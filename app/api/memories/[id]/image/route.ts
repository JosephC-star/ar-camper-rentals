import {memoryStorage,memoryOwner} from '@/lib/memories-server';
import {validMemoryId} from '@/lib/memories-validation';
export const dynamic='force-dynamic';
export async function GET(request:Request,context:{params:Promise<{id:string}>}){
 const {id}=await context.params;if(!validMemoryId(id))return new Response('Not found',{status:404});
 try{const {db,bucket}=memoryStorage();const row=await db.prepare('SELECT image_key,image_type,status FROM camp_memories WHERE id = ?').bind(id).first<{image_key:string;image_type:string;status:string}>();
 if(!row||(row.status!=='approved'&&!await memoryOwner(request)))return new Response('Not found',{status:404,headers:{'Cache-Control':'no-store'}});
 const image=await bucket.get(row.image_key);if(!image)return new Response('Not found',{status:404});
 return new Response(image.body,{headers:{'Content-Type':row.image_type,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Content-Disposition':'inline'}});
 }catch{return new Response('Photo unavailable',{status:503,headers:{'Cache-Control':'no-store'}})}
}
