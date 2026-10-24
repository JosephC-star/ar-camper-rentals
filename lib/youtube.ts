/** Accept video links only; never use a pasted URL directly as an iframe source. */
export function youtubeVideoId(value?:string):string|null {
 if(!value?.trim())return null;
 const input=value.trim();
 try{
  const url=new URL(/^https?:\/\//i.test(input)?input:`https://${input}`);
  if(!['https:','http:'].includes(url.protocol)||url.username||url.password||url.port)return null;
  const host=url.hostname.toLowerCase();
  const parts=url.pathname.split('/').filter(Boolean);
  let id:string|null=null;
  if(['youtu.be','www.youtu.be'].includes(host)&&parts.length===1)id=parts[0];
  else if(['youtube.com','www.youtube.com','m.youtube.com','music.youtube.com'].includes(host)){
   if(parts.length===1&&parts[0]==='watch')id=url.searchParams.get('v');
   else if(parts.length===2&&['embed','shorts','live'].includes(parts[0]))id=parts[1];
  }else if(['youtube-nocookie.com','www.youtube-nocookie.com'].includes(host)&&parts.length===2&&parts[0]==='embed')id=parts[1];
  return id&&/^[a-zA-Z0-9_-]{11}$/.test(id)?id:null;
 }catch{return null}
}
export function youtubeWatchUrl(value?:string):string {
 const id=youtubeVideoId(value);return id?`https://www.youtube.com/watch?v=${id}`:'';
}
