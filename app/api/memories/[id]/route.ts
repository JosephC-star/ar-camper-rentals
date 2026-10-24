import {memoryStorage,boardJson,memoryOwner,sameOrigin} from '@/lib/memories-server';
import {validMemoryId} from '@/lib/memories-validation';
export const dynamic='force-dynamic';
type Context={params:Promise<{id:string}>};
export async function PATCH(request:Request,context:Context){
 if(!sameOrigin(request)||!await memoryOwner(request))return boardJson({error:'Please sign in again with an approved owner account.'},401);
 const {id}=await context.params;if(!validMemoryId(id))return boardJson({error:'Memory not found.'},404);
 try{const body=await request.json() as {status:string};if(!['pending','approved','rejected'].includes(body.status))return boardJson({error:'Choose approve, hide, or reject.'},400);
 const {db}=memoryStorage();const result=await db.prepare('UPDATE camp_memories SET status = ?,reviewed_at = ? WHERE id = ?').bind(body.status,Date.now(),id).run();return result.meta.changes?boardJson({ok:true}):boardJson({error:'Memory not found.'},404);
 }catch{return boardJson({error:'The review could not be saved. Please try again.'},503)}
}
export async function DELETE(request:Request,context:Context){
 if(!sameOrigin(request)||!await memoryOwner(request))return boardJson({error:'Please sign in again with an approved owner account.'},401);
 const {id}=await context.params;if(!validMemoryId(id))return boardJson({error:'Memory not found.'},404);
 try{const {db,bucket}=memoryStorage();const row=await db.prepare('SELECT image_key FROM camp_memories WHERE id = ?').bind(id).first<{image_key:string}>();if(!row)return boardJson({error:'Memory not found.'},404);
 // Hide before removing bytes, so partial failures cannot expose an unreviewed photo.
 await db.prepare("UPDATE camp_memories SET status = 'rejected' WHERE id = ?").bind(id).run();await bucket.delete(row.image_key);await db.prepare('DELETE FROM camp_memories WHERE id = ?').bind(id).run();return boardJson({ok:true});
 }catch{return boardJson({error:'The memory could not be fully removed. Please try again.'},503)}
}
