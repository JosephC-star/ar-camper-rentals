export const MAX_MEMORY_BYTES=2*1024*1024;
export type Memory={id:string;nickname:string;caption:string;story:string;gear:string;status:'pending'|'approved'|'rejected';created_at:number};
export function validateMemory(input:{nickname:unknown;caption:unknown;story:unknown;gear:unknown;consent:unknown}){
 const read=(value:unknown)=>typeof value==='string'?value.trim():'';
 const data={nickname:read(input.nickname),caption:read(input.caption),story:read(input.story),gear:read(input.gear)};
 if(!data.nickname||data.nickname.length>50)throw new Error('Use a first name or nickname up to 50 characters.');
 if(!data.caption||data.caption.length>90)throw new Error('Add a short caption, up to 90 characters.');
 if(data.story.length>1000||data.gear.length>100)throw new Error('Keep your story under 1,000 characters and gear under 100.');
 if(input.consent!=='yes')throw new Error('Please confirm permission to publish your photo and story.');
 return data;
}
export function memoryImageType(bytes:Uint8Array):string|null{
 if(bytes.length>=3&&bytes[0]===255&&bytes[1]===216&&bytes[2]===255)return 'image/jpeg';
 if(bytes.length>=8&&[137,80,78,71,13,10,26,10].every((n,i)=>bytes[i]===n))return 'image/png';
 if(bytes.length>=12&&String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP')return 'image/webp';
 return null;
}
export function validMemoryId(id:string){return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)}
