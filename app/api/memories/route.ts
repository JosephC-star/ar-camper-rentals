import {memoryStorage,boardJson,memoryOwner,sameOrigin} from '@/lib/memories-server';
import {validateMemory,memoryImageType,MAX_MEMORY_BYTES,validMemoryId} from '@/lib/memories-validation';
export const dynamic='force-dynamic';
export async function GET(request:Request){
 try{const {db}=memoryStorage();const query=new URL(request.url).searchParams;const admin=query.get('manage')==='1';if(admin&&!await memoryOwner(request))return boardJson({error:'Please sign in again with an approved owner account.'},401);
 const offset=Math.max(0,Math.min(100000,Math.floor(Number(query.get('offset'))||0)));
 const filter=admin&&['pending','approved','rejected'].includes(query.get('status')||'')?query.get('status'):null;
 const sql=`SELECT id,nickname,caption,story,gear,status,created_at FROM camp_memories ${admin?(filter?'WHERE status = ?':''):"WHERE status = 'approved'"} ORDER BY created_at DESC,id DESC LIMIT 25 OFFSET ?`;
 const statement=db.prepare(sql);const result=await (filter?statement.bind(filter,offset):statement.bind(offset)).all();
 let counts:Record<string,number>|undefined;
 if(admin){const grouped=await db.prepare('SELECT status,COUNT(*) AS count FROM camp_memories GROUP BY status').all<{status:string;count:number}>();counts=Object.fromEntries(grouped.results.map(row=>[row.status,row.count]))}
 return boardJson({posts:result.results.slice(0,24),next:result.results.length>24?offset+24:null,...(counts?{counts}:{})});
 }catch{return boardJson({error:'The memory board is temporarily unavailable. Please try again soon.'},503)}
}
export async function POST(request:Request){
 if(!sameOrigin(request))return boardJson({error:'Please submit your photo through this website.'},403);
 if(Number(request.headers.get('content-length')||0)>MAX_MEMORY_BYTES+20000)return boardJson({error:'Please choose a smaller photo.'},413);
 try{const {db,bucket}=memoryStorage();const form=await request.formData();if(form.get('website'))return boardJson({message:'Thanks for sharing your adventure.'},202);
 const id=String(form.get('id')||'');if(!validMemoryId(id))return boardJson({error:'Please refresh the form and try again.'},400);
 const data=validateMemory({nickname:form.get('nickname'),caption:form.get('caption'),story:form.get('story'),gear:form.get('gear'),consent:form.get('consent')});
 const photo=form.get('photo');if(!(photo instanceof File)||!photo.size||photo.size>MAX_MEMORY_BYTES)return boardJson({error:'Please choose a JPG, PNG, or WebP photo under 2 MB.'},400);
 const bytes=new Uint8Array(await photo.arrayBuffer());const type=memoryImageType(bytes);if(!type)return boardJson({error:'That file is not a supported photo. Please choose JPG, PNG, or WebP.'},400);
 if(await db.prepare('SELECT id FROM camp_memories WHERE id = ?').bind(id).first())return boardJson({message:'Your photo has been received for review.'},202);
 const waiting=await db.prepare("SELECT COUNT(*) AS count FROM camp_memories WHERE status = 'pending'").first<{count:number}>();if((waiting?.count||0)>=500)return boardJson({error:'The board has plenty of memories waiting for review. Please try again later.'},429);
 const day=new Date().toISOString().slice(0,10);const identity=request.headers.get('cf-connecting-ip')||'local-preview';const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(day+':camp-memories:'+identity)))).map(n=>n.toString(16).padStart(2,'0')).join('');
 const limit=await db.prepare('INSERT INTO camp_memory_limits (id,day,count) VALUES (?,?,1) ON CONFLICT(id) DO UPDATE SET count = count + 1 WHERE count < 5 RETURNING count').bind(hash,day).first();if(!limit)return boardJson({error:'You’ve shared several memories today. Please try again tomorrow.'},429);
 await db.prepare('DELETE FROM camp_memory_limits WHERE day < ?').bind(new Date(Date.now()-172800000).toISOString().slice(0,10)).run();
 const imageKey='camp-memories/'+id+'/'+crypto.randomUUID();await bucket.put(imageKey,bytes,{httpMetadata:{contentType:type}});
 try{await db.prepare('INSERT INTO camp_memories (id,nickname,caption,story,gear,image_key,image_type,status,created_at,consent) VALUES (?,?,?,?,?,?,?,\'pending\',?,1)').bind(id,data.nickname,data.caption,data.story,data.gear,imageKey,type,Date.now()).run()}catch{await bucket.delete(imageKey);throw new Error('Could not save your submission. Please try again.')}
 return boardJson({message:'Your photo is pinned in our review queue. It will appear after approval.'},202);
 }catch(error){return boardJson({error:error instanceof Error&&(/Use a first|Add a short|Keep your|confirm permission/.test(error.message))?error.message:'We couldn’t save your memory. Please try again shortly.'},400)}
}
