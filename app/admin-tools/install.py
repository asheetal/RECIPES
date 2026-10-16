from pathlib import Path
import subprocess,json,datetime,shutil,time,re,os,urllib.request,urllib.error
ROOT=Path('/home/sheetal/librechat');B=Path(__file__).resolve().parent
os.chdir(ROOT)
def run(a,**kw):return subprocess.run(a,check=True,**kw)
def out(a,**kw):return subprocess.check_output(a,text=True,**kw)
run(['lab-data-guard','check'])
info=json.loads(out(['docker','inspect','librechat']))[0]
old_dist=Path(next(m['Source'] for m in info['Mounts'] if m['Destination']=='/app/client/dist'))
fallback_source = Path('/home/sheetal/librechat/triage-json-20261009T021550Z/admin-capabilities/client-source')
source = old_dist.parent / 'client-source'
if not source.is_dir():
    source = fallback_source
assert source.is_dir(), 'Active UI source missing' 
assert shutil.disk_usage(ROOT).free>8*1024**3,'Less than 8 GB free; paused before building'
stamp=datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ');d=ROOT/('admin-tools-'+stamp);d.mkdir(mode=0o755)
work=d/'work';(work/'client').mkdir(parents=True);shutil.copytree(source,work/'client/src')
backend=['routes/admin/users.js','controllers/UserController.js','middleware/checkInviteUser.js','routes/messages.js']
for f in backend:
 p=work/'api/server'/f;p.parent.mkdir(parents=True,exist_ok=True)
 run(['docker','cp','librechat:/app/api/server/'+f,str(p)],stdout=subprocess.DEVNULL)
run(['python3',str(B/'patch.py'),str(work)])
shutil.move(str(work/'client/src'),str(d/'client-source'))
shutil.copytree(B,d/'runtime',ignore=shutil.ignore_patterns('__pycache__'))
old=(ROOT/'docker-compose.override.yml').read_bytes();(d/'override.before.yml').write_bytes(old);(d/'override.before.yml').chmod(0o600)
builder='libreadmin-'+stamp.lower();changed=False
try:
 run(['docker','run','-d','--name',builder,'--memory=3g','--cpus=2','--entrypoint','sh',info['Image'],'-c','while :; do sleep 30; done'],stdout=subprocess.DEVNULL)
 run(['docker','cp',str(d/'client-source')+'/.',builder+':/app/client/src/'],stdout=subprocess.DEVNULL)
 run(['docker','cp',str(d/'runtime'),builder+':/app/admin-tools'],stdout=subprocess.DEVNULL)
 run(['docker','exec',builder,'node','/app/admin-tools/test.cjs'])
 for f in backend:
  run(['docker','cp',str(work/'api/server'/f),builder+':/app/api/server/'+f],stdout=subprocess.DEVNULL)
  run(['docker','exec',builder,'node','--check','/app/api/server/'+f])
 run(['docker','exec',builder,'node','/app/admin-tools/middleware-test.cjs','/app/api/server/middleware/checkInviteUser.js'])
 print('Building Admin popup. Log: '+str(d/'build.log'),flush=True)
 with (d/'build.log').open('w') as log:
  proc=subprocess.Popen(['docker','exec','--user','0','-e','NODE_ENV=development','-e','NODE_OPTIONS=--max-old-space-size=2304','-w','/app',builder,'sh','-lc','npm ci --include=dev --no-audit --no-fund && cd client && NODE_ENV=production ../node_modules/.bin/vite build && node scripts/post-build.cjs'],stdout=log,stderr=subprocess.STDOUT)
  while proc.poll() is None:
   try:proc.wait(timeout=30)
   except subprocess.TimeoutExpired:print('Build running; live chats remain available.',flush=True)
  if proc.returncode:raise RuntimeError('Build failed; see build.log')
 run(['docker','cp',builder+':/app/client/dist',str(d/'dist')],stdout=subprocess.DEVNULL)
 index=d/'dist/index.html';html=index.read_text();oldhtml=(old_dist/'index.html').read_text()
 styles=re.findall(r'<style\b[^>]*\bid=["\']lab-[^"\']+["\'][^>]*>.*?</style>',oldhtml,re.S)
 assert html.count('</head>')==1
 index.write_text(html.replace('</head>','\n'.join(styles)+'\n<meta name="lab-admin-tools" content="v1">\n</head>'))
 for f in (old_dist/'assets').rglob('*'):
  if f.is_file():
   target=d/'dist/assets'/f.relative_to(old_dist/'assets')
   if not target.exists():target.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(f,target)
 assert any('Add user email' in f.read_text() for f in (d/'dist/assets').glob('*.js')),'Compiled admin UI missing'
 run(['chmod','-R','a+rX',str(d/'dist'),str(d/'client-source'),str(d/'runtime'),str(work)])
 js=r'''
const fs=require('fs');let load,dump;try{const y=require('js-yaml');load=y.load;dump=x=>y.dump(x,{lineWidth:-1,noRefs:true})}catch(e){if(e.code!=='MODULE_NOT_FOUND')throw e;const y=require('yaml');load=y.parse;dump=y.stringify}
const c=load(fs.readFileSync(0,'utf8')),d=process.argv[1];if(!c.services.api)throw Error('api missing');const mounts=[[d+'/dist','/app/client/dist'],[d+'/runtime','/app/admin-tools']];for(const f of ['routes/admin/users.js','controllers/UserController.js','middleware/checkInviteUser.js'])mounts.push([d+'/work/api/server/'+f,'/app/api/server/'+f]);for(const [source,target] of mounts){const a=c.services.api;a.volumes=(a.volumes||[]).filter(v=>(typeof v==='string'?v.split(':')[1]:v.target)!==target);a.volumes.push({type:'bind',source,target,read_only:true});}process.stdout.write(dump(c));
'''
 config=out(['docker','exec','-i','-w','/app','librechat','node','-e',js,str(d)],input=old.decode())
 changed=True;(ROOT/'docker-compose.override.yml').write_text(config)
 run(['docker','compose','config','--quiet']);run(['lab-data-guard','upgrade'])
 # Unauthenticated requests must not reach user listing or invitation creation.
 check=r'''
(async()=>{for(const [path,method] of [['/api/admin/users','GET'],['/api/admin/users/invite','POST']]){const r=await fetch('http://127.0.0.1:3080'+path,{method,headers:{'Content-Type':'application/json'},...(method==='POST'?{body:'{}'}:{})});if(![401,403].includes(r.status))throw Error('Admin endpoint not protected: '+r.status);}console.log('PASS: unauthenticated admin access blocked.');})().catch(e=>{console.error(e.message);process.exitCode=1});
'''
 run(['docker','exec','librechat','node','-e',check])
 print('Installed. Admin icon: invite and delete users. Hard-refresh browser. No invitation emails were sent during installation.')
except BaseException:
 if changed:
  (ROOT/'docker-compose.override.yml').write_bytes(old);subprocess.run(['lab-data-guard','upgrade'])
 print('Installation failed; configuration restored. Check '+str(d/'build.log'))
 raise
finally:subprocess.run(['docker','rm','-f',builder],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
