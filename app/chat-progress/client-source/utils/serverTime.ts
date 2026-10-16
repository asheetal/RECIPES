import { apiBaseUrl } from 'librechat-data-provider';
import { format as originalFormat, formatDistance } from 'date-fns';
let zone = 'America/Los_Angeles';
let epoch = NaN;
let sampled = 0;
export const serverTimeZone = () => zone;
export const serverNow = () => new Date(epoch + performance.now() - sampled);
export async function syncServerClock() {
  const start=performance.now();
  const response=await fetch(apiBaseUrl()+'/api/server-clock',{cache:'no-store',credentials:'same-origin',signal:AbortSignal.timeout(8000)});
  if(!response.ok) throw Error('Server clock unavailable');
  const data=await response.json();
  if(!Number.isFinite(data.epochMs)||typeof data.timeZone!=='string')throw Error('Invalid server clock');
  new Intl.DateTimeFormat('en',{timeZone:data.timeZone}).format(new Date(data.epochMs));
  sampled=performance.now();epoch=data.epochMs+(sampled-start)/2;zone=data.timeZone;
}
export async function initializeServerClock(){
 await syncServerClock();
 setInterval(()=>void syncServerClock().catch(()=>{}),60000);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)void syncServerClock().catch(()=>{});});
}
export function serverDateTimeFormat(locale?: Intl.LocalesArgument,options: Intl.DateTimeFormatOptions={}){
 return new Intl.DateTimeFormat(locale,{...options,timeZone:zone});
}
export function serverLocaleDate(value: Date,locale?: Intl.LocalesArgument,options: Intl.DateTimeFormatOptions={}){
 return value.toLocaleDateString(locale,{...options,timeZone:zone});
}
export function serverLocaleTime(value: Date,locale?: Intl.LocalesArgument,options: Intl.DateTimeFormatOptions={}){
 return value.toLocaleTimeString(locale,{...options,timeZone:zone});
}
export function serverLocale(value: Date,locale?: Intl.LocalesArgument,options: Intl.DateTimeFormatOptions={}){
 return value.toLocaleString(locale,{...options,timeZone:zone});
}
export function serverParts(value:Date=serverNow()){
 const p=Object.fromEntries(serverDateTimeFormat('en-US',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(value).map(x=>[x.type,x.value]));
 return {year:+p.year,month:+p.month,day:+p.day,hour:+p.hour,minute:+p.minute,second:+p.second};
}
// UTC calendar surrogates are used only for calendar fields, never persisted.
export function serverCalendar(value:Date=serverNow()){
 const p=serverParts(value);return new Date(Date.UTC(p.year,p.month-1,p.day,p.hour,p.minute,p.second));
}
export function serverFormat(value:Date|number,pattern:string,options?: Parameters<typeof originalFormat>[2]){
 const p=serverParts(new Date(value));
 // Existing callers format calendar dates only; noon avoids local DST gaps.
 return originalFormat(new Date(p.year,p.month-1,p.day,12),pattern,options);
}
export function serverDistanceToNow(value:Date|number,options?: Parameters<typeof formatDistance>[2]){
 return formatDistance(value,serverNow(),options);
}
