from pathlib import Path
import subprocess,json,datetime,shutil,time,re,os,hashlib
ROOT=Path('/home/sheetal/librechat');CODE=Path('/home/sheetal/code-interpreter');B=Path(__file__).resolve().parent
os.chdir(ROOT)
def run(a,**kw):return subprocess.run(a,check=True,**kw)
def out(a,**kw):return subprocess.check_output(a,text=True,**kw)
run(['lab-data-guard','check']);run(['python3',str(B/'test.py')])
assert shutil.which('debugfs'),'debugfs is required; stopped before changes'
info=json.loads(out(['docker','inspect','librechat']))[0]
runner=json.loads(out(['docker','inspect','sandbox-runner']))[0]
env=dict(x.split('=',1) for x in runner['Config']['Env'] if '=' in x)
assert env.get('LAUNCHER_ROOT_DISK')=='/sandbox-rootfs.img','Unexpected runner mode; stopped'
assert env.get('LAUNCHER_ROOT_DISK_READ_ONLY','true').lower()=='true','Runner image must be read-only'
size=int(out(['docker','exec','sandbox-runner','stat','-c','%s','/sandbox-rootfs.img']).strip())
assert shutil.disk_usage(ROOT).free>size+8*1024**3,'Insufficient free disk for an isolated runtime copy plus UI build; paused'
mounts={m['Destination']:Path(m['Source']) for m in info['Mounts']}
source=mounts['/app/client/dist'].parent/'client-source';assert source.is_dir(),'Active frontend source missing'
checks=json.loads((B/'expected.json').read_text())
for path,expected in checks.items():
 data=subprocess.check_output(['docker','exec','librechat','cat',path])
 assert hashlib.sha256(data).hexdigest()==expected,'Live code changed: '+path+'; stopped without changes'
stamp=datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ');d=ROOT/('workflow-'+stamp);d.mkdir(mode=0o755)
shutil.copytree(source,d/'client-source');shutil.copy2(B/'progress.js',d/'client-source/components/Chat/Messages/Content/progress.js');shutil.copy2(B/'ContentParts.tsx',d/'client-source/components/Chat/Messages/Content/ContentParts.tsx')
shutil.copytree(mounts['/app/project-files-feature'],d/'project-files')
shutil.copy2(B/'project-files.cjs',d/'project-files/project-files.cjs');shutil.copy2(B/'files.cjs',d/'project-files/workflow-files.cjs')
shutil.copytree(B,d/'runtime',ignore=shutil.ignore_patterns('__pycache__'))
service=out(['docker','exec','librechat','cat','/app/api/server/services/ToolService.js'])
service+='\nconst workflowTools = require("/app/workflow-feature/tools.cjs");\nmodule.exports.loadAgentTools = workflowTools.wrapLoad(module.exports.loadAgentTools);\nmodule.exports.loadToolsForExecution = workflowTools.wrapExecution(module.exports.loadToolsForExecution);\n'
(d/'ToolService.js').write_text(service)
old=(ROOT/'docker-compose.override.yml').read_bytes();co=CODE/'docker-compose.override.yml';old_code=co.read_bytes() if co.exists() else None
(d/'override.before.yml').write_bytes(old);(d/'override.before.yml').chmod(0o600)
if old_code is not None:(d/'runner.before.yml').write_bytes(old_code);(d/'runner.before.yml').chmod(0o600)
js=r'''
const fs=require('fs');let load,dump;try{const y=require('js-yaml');load=y.load;dump=x=>y.dump(x,{lineWidth:-1,noRefs:true})}catch(e){if(e.code!=='MODULE_NOT_FOUND')throw e;const y=require('yaml');load=y.parse;dump=y.stringify}
const i=JSON.parse(fs.readFileSync(0,'utf8')),c=load(i.config)||{};c.services??={};c.services[i.service]??={};const s=c.services[i.service];for(const [source,target] of i.mounts){s.volumes=(s.volumes||[]).filter(v=>(typeof v==='string'?v.split(':')[1]:v.target)!==target);s.volumes.push({type:'bind',source,target,read_only:true});}process.stdout.write(dump(c));
'''
def compose_patch(config,service,pairs):return out(['docker','exec','-i','-w','/app','librechat','node','-e',js],input=json.dumps({'config':config,'service':service,'mounts':pairs}))
changed=False;runner_changed=False;builder='libreworkflow-'+stamp.lower()
try:
 # Modify a private copy of the runtime image, never the active disk or user data.
 print('Preparing isolated runtime copy; no package downloads or image rebuild.',flush=True)
 run(['docker','cp','sandbox-runner:/sandbox-rootfs.img',str(d/'sandbox-rootfs.img')],stdout=subprocess.DEVNULL)
 image=str(d/'sandbox-rootfs.img');compiled=str(d/'runner-index.js')
 run(['debugfs','-R','dump /sandbox_api/.build/index.js '+compiled,image],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
 assert Path(compiled).is_file(),'Runtime bundle missing'
 run(['python3',str(B/'patch_runner.py'),compiled])
 for command in ['rm /sandbox_api/.build/index.js','write '+compiled+' /sandbox_api/.build/index.js','set_inode_field /sandbox_api/.build/index.js mode 0100644']:
  run(['debugfs','-w','-R',command,image],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
 verify=str(d/'runner-verify.js');run(['debugfs','-R','dump /sandbox_api/.build/index.js '+verify,image],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
 assert Path(verify).read_bytes()==Path(compiled).read_bytes(),'Runtime image verification failed'
 Path(verify).unlink()
 run(['docker','run','-d','--name',builder,'--memory=3g','--cpus=2','--entrypoint','sh',info['Image'],'-c','while :; do sleep 30; done'],stdout=subprocess.DEVNULL)
 run(['docker','exec',builder,'mkdir','-p','/tmp/workflow-feature']);run(['docker','cp',str(d/'runtime')+'/.',builder+':/tmp/workflow-feature/'],stdout=subprocess.DEVNULL)
 run(['docker','exec',builder,'node','/tmp/workflow-feature/test.cjs']);run(['docker','exec',builder,'node','/tmp/workflow-feature/file-test.cjs'])
 for name in ['Graph.cjs','tools.cjs','files.cjs','project-files.cjs','client.js','code-process.js']:
  run(['docker','exec',builder,'node','--check','/tmp/workflow-feature/'+name])
 run(['docker','cp',str(d/'client-source')+'/.',builder+':/app/client/src/'],stdout=subprocess.DEVNULL)
 print('Building status update. Log: '+str(d/'build.log'),flush=True)
 with (d/'build.log').open('w') as log:
  proc=subprocess.Popen(['docker','exec','--user','0','-e','NODE_ENV=development','-e','NODE_OPTIONS=--max-old-space-size=2304','-w','/app',builder,'sh','-lc','npm ci --include=dev --no-audit --no-fund && cd client && NODE_ENV=production ../node_modules/.bin/vite build && node scripts/post-build.cjs'],stdout=log,stderr=subprocess.STDOUT)
  while proc.poll() is None:
   try:proc.wait(timeout=30)
   except subprocess.TimeoutExpired:print('UI build running; live chats remain available.',flush=True)
  if proc.returncode:raise RuntimeError('UI build failed; see build.log')
 run(['docker','cp',builder+':/app/client/dist',str(d/'dist')],stdout=subprocess.DEVNULL)
 index=d/'dist/index.html';html=index.read_text();oldhtml=(mounts['/app/client/dist']/'index.html').read_text()
 styles=re.findall(r'<style\b[^>]*\bid=["\']lab-[^"\']+["\'][^>]*>.*?</style>',oldhtml,re.S)
 index.write_text(html.replace('</head>','\n'.join(styles)+'\n</head>'))
 for f in (mounts['/app/client/dist']/'assets').rglob('*'):
  if f.is_file():
   t=d/'dist/assets'/f.relative_to(mounts['/app/client/dist']/'assets')
   if not t.exists():t.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(f,t)
 pairs=[(str(d/'project-files'),'/app/project-files-feature'),(str(d/'runtime'),'/app/workflow-feature'),(str(d/'ToolService.js'),'/app/api/server/services/ToolService.js'),(str(d/'runtime/client.js'),'/app/api/server/controllers/agents/client.js'),(str(d/'runtime/code-process.js'),'/app/api/server/services/Files/Code/process.js'),(str(d/'runtime/Graph.cjs'),'/app/node_modules/@librechat/agents/dist/cjs/graphs/Graph.cjs'),(str(d/'runtime/truncation.cjs'),'/app/node_modules/@librechat/agents/dist/cjs/utils/truncation.cjs'),(str(d/'dist'),'/app/client/dist')]
 new=compose_patch(old.decode(),'api',pairs);new_code=compose_patch(old_code.decode() if old_code else 'services: {}','sandbox-runner',[(image,'/sandbox-rootfs.img')])
 run(['chmod','-R','a+rX',str(d/'runtime'),str(d/'project-files'),str(d/'dist'),str(d/'client-source')])
 runner_changed=True;co.write_text(new_code)
 run(['docker','compose','config','--quiet'],cwd=CODE)
 run(['docker','compose','up','-d','--no-deps','--pull','never','sandbox-runner'],cwd=CODE)
 for _ in range(60):
  state=json.loads(out(['docker','inspect','sandbox-runner']))[0]['State']
  if state.get('Health',{}).get('Status')=='healthy':break
  time.sleep(2)
 else:raise RuntimeError('Runner health check failed')
 # Signed test uses only synthetic files under a dedicated test principal.
 code="from pathlib import Path\nfor n in ['references.bib','Makefile','style.sty']:\n Path('/mnt/data/'+n).write_text('workflow-persistence-test')\nprint('WORKFLOW_PASS')"
 payload={'language':'python','version':'3.14.4','files':[{'content':code}]}
 signed=out(['docker','exec','-i','librechat','node','-e',(B/'sign.cjs').read_text()],input=json.dumps({'payload':payload,'env':(CODE/'.env').read_text()}))
 raw=out(['docker','exec','-i','sandbox-runner','curl','-fsS','--max-time','60','http://127.0.0.1:2000/api/v2/execute','-H','Content-Type: application/json','--data-binary','@-'],input=signed)
 result=json.loads(raw);assert result.get('run',{}).get('code')==0,result
 names={f.get('name') or f.get('filename') for f in result.get('files',[])}
 assert {'references.bib','Makefile','style.sty'}<=names,'Runner did not persist research file types: '+str(names)
 print('PASS: live sandbox persists bibliography, Makefile and style files.',flush=True)
 changed=True;(ROOT/'docker-compose.override.yml').write_text(new)
 run(['docker','compose','config','--quiet']);run(['lab-data-guard','upgrade'])
 run(['docker','exec','-w','/app','librechat','node','-e',"require('module-alias/register');const t=require('/app/workflow-feature/tools.cjs');if(t.def.name!=='research_files')throw Error('Tool missing');require('/app/project-files-feature/project-files.cjs');console.log('PASS: live workflow modules');"])
 print('Installed. Chat files take priority; project transfers preserve exact bytes. Refresh browser and send a new message.')
except BaseException:
 if changed:(ROOT/'docker-compose.override.yml').write_bytes(old)
 if runner_changed:
  if old_code is None:co.unlink(missing_ok=True)
  else:co.write_bytes(old_code)
  subprocess.run(['docker','compose','up','-d','--no-deps','--pull','never','sandbox-runner'],cwd=CODE)
 if changed:subprocess.run(['lab-data-guard','upgrade'])
 print('Installation stopped; prior configuration restored. User data was not modified by the installer.')
 raise
finally:subprocess.run(['docker','rm','-f',builder],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
