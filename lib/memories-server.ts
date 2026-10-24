import {env} from 'cloudflare:workers';
export function memoryStorage(){if(!env.DB||!env.BUCKET)throw new Error('The memory board is getting ready. Please try again shortly.');return {db:env.DB,bucket:env.BUCKET}}
export function boardJson(data:unknown,status=200){return Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}})}
export async function memoryOwner(request:Request):Promise<boolean>{
 const authorization=request.headers.get('authorization');if(!authorization?.startsWith('Bearer '))return false;
 const url=process.env.NEXT_PUBLIC_INVENTORY_SUPABASE_URL||'https://gscaqzhdxqwqgynwtpom.supabase.co';
 const key=process.env.NEXT_PUBLIC_INVENTORY_SUPABASE_ANON_KEY||'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzY2FxemhkeHF3cWd5bnd0cG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzNzMyMzgsImV4cCI6MjEwNzk0OTIzOH0.SyYloKkNbomc0_QlHIVmI4Yr4pvKnheMEvS5C3ZRChs';
 try{const response=await fetch(url+'/rest/v1/rpc/is_inventory_owner',{method:'POST',headers:{apikey:key,Authorization:authorization,'Content-Type':'application/json'},body:'{}'});return response.ok&&(await response.json())===true}catch{return false}
}
export function sameOrigin(request:Request){return request.headers.get('origin')===new URL(request.url).origin}
