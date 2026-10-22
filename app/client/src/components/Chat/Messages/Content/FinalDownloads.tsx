import type { TAttachment } from 'librechat-data-provider';
import LogLink from './Parts/LogLink';

export default function FinalDownloads({files,missing=[]}:{files:TAttachment[];missing?:string[]}) {
 return <div className="my-2 flex flex-col items-start gap-2">
  {files.map(f=><LogLink key={f.file_id || f.filepath} href={f.filepath ?? ''}
   filename={f.filename ?? ''} file_id={f.file_id} user={f.user} source={f.source}>
   Download {f.filename}
  </LogLink>)}
  {missing.length>0&&<p role="alert" className="text-sm">Download unavailable for: {missing.join(', ')}. The file has not been attached successfully.</p>}
 </div>;
}
