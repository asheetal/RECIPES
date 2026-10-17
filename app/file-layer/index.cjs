'use strict';
const fs = require('node:fs/promises');
const path = require('node:path');
const { TextDecoder } = require('node:util');
const app = require('node:module').createRequire('/app/package.json');
const { XMLParser, XMLValidator } = app('fast-xml-parser');
const yauzl = app('yauzl');
const accepted = new WeakSet();
const mime = Object.freeze({txt:'text/plain', pdf:'application/pdf', xlsx:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', pptx:'application/vnd.openxmlformats-officedocument.presentationml.presentation', docx:'application/vnd.openxmlformats-officedocument.wordprocessingml.document', json:'application/json', xml:'application/xml'});
const instructions = 'FILES: Use research_files with action read_all and the exact file handle returned by the inventory. The file layer detects the format and returns readable contents. Use its contents for the task; do not implement another reader. Report actual reader errors accurately. read_all without names lists files. Use edit_text for hash-checked text edits and deliver for requested downloads. Verification checks saving and delivery.';
function fail(message) { const e = new Error(message); e.status = 415; throw e; }
function xml(bytes) {
  const text = decode(bytes);
  if (/<!DOCTYPE|<!ENTITY/i.test(text)) fail('XML entities and document type declarations are unsupported');
  if (XMLValidator.validate(text) !== true) fail('Invalid XML document');
  return new XMLParser({ignoreAttributes:false, attributeNamePrefix:'', parseTagValue:false, parseAttributeValue:false}).parse(text);
}
function decode(bytes) {
  let encoding = 'utf-8', offset = 0;
  if (bytes[0] === 0xff && bytes[1] === 0xfe) { encoding = 'utf-16le'; offset = 2; }
  else if (bytes[0] === 0xfe && bytes[1] === 0xff) { encoding = 'utf-16be'; offset = 2; }
  let text;
  try { text = new TextDecoder(encoding, {fatal:true}).decode(bytes.subarray(offset)); }
  catch { fail('Unsupported binary file or text encoding'); }
  if (/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(text)) fail('Unsupported binary file');
  return text;
}
function office(bytes) {
  return new Promise((resolve,reject) => {
    yauzl.fromBuffer(bytes, {lazyEntries:true, validateEntrySizes:true}, (err,zip) => {
      if (err) return reject(err);
      let total=0, count=0, manifest=null; const names=new Set();
      function stop(e) { zip.close(); reject(e); }
      zip.on('error',stop);
      zip.on('entry',entry => {
        const n=entry.fileName;
        if (++count > 50000 || names.has(n) || n.startsWith('/') || n.includes('\\') || n.split('/').includes('..') || entry.generalPurposeBitFlag & 1 || /vbaproject/i.test(n)) return stop(new Error('Unsupported Office package'));
        names.add(n); total += entry.uncompressedSize;
        if (total > 256*1024*1024) return stop(new Error('Office package exceeds the extraction budget'));
        if (n !== '[Content_Types].xml') return zip.readEntry();
        if (entry.uncompressedSize > 2*1024*1024) return stop(new Error('Office manifest is too large'));
        zip.openReadStream(entry,(e,stream) => {
          if (e) return stop(e);
          const chunks=[]; let size=0;
          stream.on('data',b => { size+=b.length; if(size>2*1024*1024) {stream.destroy();stop(new Error('Office manifest is too large'));} else chunks.push(b); });
          stream.on('error',stop);
          stream.on('end',() => {manifest=Buffer.concat(chunks);zip.readEntry();});
        });
      });
      zip.on('end',() => {
        try {
          if (!manifest) fail('ZIP files are unsupported; choose XLSX, DOCX or PPTX');
          const root=xml(manifest).Types;
          const rows=[root?.Override??[]].flat();
          if (rows.some(r => /macroenabled/i.test(r.ContentType??''))) fail('Macro-enabled documents are unsupported');
          const types={
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml':['xlsx','xl/workbook.xml'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml':['docx','word/document.xml'],
            'application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml':['pptx','ppt/presentation.xml']
          };
          const found=rows.map(r=>types[r.ContentType]).filter(Boolean);
          if(found.length!==1 || !names.has(found[0][1])) fail('Invalid or unsupported Office document');
          resolve(found[0][0]);
        } catch(e) {reject(e);}
      });
      zip.readEntry();
    });
  });
}
class FileHandle {
  constructor(name,bytes) {this.name=name;this.bytes=bytes;}
  async inspect() {
    if(!Buffer.isBuffer(this.bytes)||!this.bytes.length) fail('Empty or missing file');
    const ext=path.extname(this.name).slice(1).toLowerCase();
    if(ext && !Object.hasOwn(mime,ext)) fail('Supported uploads: TXT, PDF, XLSX, PPTX, DOCX, JSON, XML; extensionless files are accepted');
    let kind;
    if(this.bytes.subarray(0,5).toString('ascii')==='%PDF-') {
      if(!/%%EOF/.test(this.bytes.subarray(-4096).toString('latin1'))) fail('Incomplete PDF file');
      kind='pdf';
    } else if(this.bytes[0]===0x50 && this.bytes[1]===0x4b) {
      try {kind=await office(this.bytes);} catch(e) {fail(e.message);}
    } else {
      const text=decode(this.bytes), clean=text.trim();
      kind='txt';
      try {JSON.parse(text);kind='json';} catch {if(ext==='json') fail('Invalid JSON document');}
      if(kind==='txt' && clean.startsWith('<')) {
        try {xml(this.bytes);kind='xml';} catch(e) {if(ext==='xml') throw e;}
      }
      if(ext==='xml' && kind!=='xml') fail('Invalid XML document');
    }
    if(ext && ext!==kind && !(ext==='txt' && ['json','xml'].includes(kind))) fail('File contents do not match the filename extension');
    return Object.freeze({kind,mime:mime[kind],bytes:this.bytes.length});
  }
}
function isDocumentRoute(req) { return /^\/api\/files\/?$/.test((req.originalUrl??'').split('?')[0]); }
async function validateUpload(req,res,next) {
  try {
    if(!req.file) {const e=new Error('Choose a file');e.status=400;throw e;}
    const bytes=req.file.buffer??await fs.readFile(req.file.path);
    const result=await new FileHandle(req.file.originalname,bytes).inspect();
    req.file.mimetype=result.mime; accepted.add(req.file); next();
  } catch(e) {
    if(req.file?.path) await fs.unlink(req.file.path).catch(()=>{});
    res.status(e.status??415).json({message:e.message});
  }
}
module.exports={FileHandle,instructions,isDocumentRoute,validateUpload,isValidated:file=>accepted.has(file),readerSource:()=>require('node:fs').readFileSync('/app/file-layer/document.py')};
