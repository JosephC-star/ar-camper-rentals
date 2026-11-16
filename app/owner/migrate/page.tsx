"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";

const API = "https://unosqzlrigbwwnnpabar.supabase.co";
const KEY = "sb_publishable_jCF0lEHBiP7igZ7ta1iVTA_MAWVG0gS";
type Result = { total?:number; uploaded?:number; remaining?:number; rewritten?:number; errors?:string[]; error?:string };

export default function CamperMigration() {
  const [email,setEmail]=useState("arcamperrentals@gmail.com");
  const [password,setPassword]=useState("");
  const [token,setToken]=useState("");
  const [working,setWorking]=useState(false);
  const [message,setMessage]=useState("");
  const [result,setResult]=useState<Result|null>(null);

  async function login(e:FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setWorking(true);setMessage("");
    try {
      const response=await fetch(API+"/auth/v1/token?grant_type=password",{
        method:"POST",headers:{"apikey":KEY,"content-type":"application/json"},
        body:JSON.stringify({email,password}),cache:"no-store"
      });
      const body=await response.json();
      if (!response.ok||!body.access_token) throw Error(body.msg||body.error_description||body.message||"Login failed.");
      // The server function independently confirms inventory_owners membership.
      setToken(body.access_token);setPassword("");setMessage("Signed in. Ready to copy photos.");
    } catch(e) {setMessage(e instanceof Error?e.message:"Could not sign in.");}
    finally {setWorking(false);}
  }

  async function transfer() {
    if (!token||working) return;
    setWorking(true);setMessage("Checking the photo library…");
    try {
      for(let run=0;run<24;run++) {
        const response=await fetch(API+"/functions/v1/camper-photo-migration",{
          method:"POST",
          headers:{"apikey":KEY,"authorization":"Bearer "+token,"content-type":"application/json"},
          body:"{}",cache:"no-store"
        });
        const body:Result=await response.json();
        if(!response.ok && response.status!==207) throw Error(body.error||(body.errors||[]).join("; ")||"Migration failed.");
        setResult(body);
        setMessage("Transferred this pass: "+(body.uploaded||0)+". Remaining: "+(body.remaining??"unknown")+".");
        if(body.errors?.length) throw Error(body.errors.join("; "));
        if(body.remaining===0) {setMessage("All 65 photos are copied. Inventory image URLs have been updated in Michael's new database.");break;}
        if(body.uploaded===0) throw Error("No progress was made. Stop and check photo migration logs before retrying.");
      }
    } catch(e){setMessage(e instanceof Error?e.message:"Something went wrong.");}
    finally{setWorking(false);}
  }

  return <main style={{padding:"64px 16px",minHeight:"100vh",background:"#f3f7f7",color:"#163b40",fontFamily:"system-ui,sans-serif"}}>
    <section style={{maxWidth:560,margin:"auto",background:"white",borderRadius:20,padding:30,boxShadow:"0 8px 38px #15323b16"}}>
      <p style={{fontSize:12,color:"#087f79",fontWeight:700,letterSpacing:2}}>CLEM ONS WEB CO. · PRIVATE MIGRATION</p>
      <h1 style={{fontSize:28,margin:"8px 0"}}>Camper photo migration</h1>
      <p>Move the 65 uploaded photos to the new Supabase project. This does not change the live camper website.</p>
      {!token && <form onSubmit={login} style={{display:"grid",gap:14}}>
        <label style={{display:"grid",gap:5}}>Owner email
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required style={{padding:12,borderRadius:8,border:"1px solid #adbfbb"}} />
        </label>
        <label style={{display:"grid",gap:5}}>New-project password
          <input type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} required style={{padding:12,borderRadius:8,border:"1px solid #adbfbb"}} />
        </label>
        <button disabled={working} style={{padding:14,background:"#087f79",color:"white",border:0,borderRadius:8,fontWeight:700}}>Sign in securely</button>
      </form>}
      {token && <>
        <p>Authentication successful. Only the inventory owner can run this transfer.</p>
        <button onClick={transfer} disabled={working} style={{padding:14,background:"#087f79",color:"white",border:0,borderRadius:8,fontWeight:700}}>
          {working?"Transferring photos…":"Start / resume photo migration"}
        </button>
        <button onClick={()=>{setToken("");setResult(null);setMessage("Signed out.");}} disabled={working} style={{marginLeft:12,padding:12,borderRadius:8,border:"1px solid #adbfbb",background:"white"}}>Sign out</button>
      </>}
      <p role="status" style={{marginTop:20,overflowWrap:"anywhere"}}>{message}</p>
      {result && <dl><dt>Original photos</dt><dd>{result.total??"—"}</dd><dt>Still to copy</dt><dd>{result.remaining??"—"}</dd><dt>Listings with links updated in final pass</dt><dd>{result.rewritten??"—"}</dd></dl>}
      <p style={{marginTop:24,fontSize:13,color:"#51696b"}}>No password is saved on this page. This tool should be removed after migration verification.</p>
      <Link href="/" style={{color:"#087f79"}}>Back to camper rentals</Link>
    </section>
  </main>;
}
