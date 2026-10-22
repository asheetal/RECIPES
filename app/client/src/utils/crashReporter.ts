import { request, apiBaseUrl } from 'librechat-data-provider';
const reported=new Set<string>();
export function reportCrash(error:unknown){
 const e=error as {message?:string;stack?:string};const message=String(e?.message||error||'Frontend error');const stack=String(e?.stack||'');const key=message+stack;
 if(reported.has(key))return;reported.add(key);if(reported.size>200)reported.delete(reported.values().next().value as string);
 void request.post(`${apiBaseUrl()}/api/crash-reports`,{eventId:crypto.randomUUID(),message:message.slice(0,16000),stack:stack.slice(0,32000),path:location.pathname,browser:navigator.userAgent}).catch(()=>{reported.delete(key);});
}
if(typeof window!=='undefined'){
 window.addEventListener('error',e=>reportCrash(e.error||e.message));
 window.addEventListener('unhandledrejection',e=>reportCrash(e.reason));
}
