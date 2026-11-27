"use client";

import {MessageCircle} from "lucide-react";
import {useEffect,useState,type ReactNode} from "react";
import {CAMPER_MESSENGER_URL} from "@/lib/contact";

export function MessengerLink({className,children}:{className?:string;children?:ReactNode}) {
 return <a className={className} href={CAMPER_MESSENGER_URL} target="_blank" rel="noopener noreferrer" aria-label="Message Arkansas Camper Rentals on Messenger (opens in a new tab)"><MessageCircle size={20} aria-hidden="true"/>{children||"Message us on Messenger"}</a>;
}

export default function FloatingMessenger(){
 const [nearFooter,setNearFooter]=useState(false);
 const [modalOpen,setModalOpen]=useState(false);
 useEffect(()=>{
  const footer=document.getElementById("site-footer");
  const observer=typeof IntersectionObserver!=="undefined"?new IntersectionObserver(([entry])=>setNearFooter(entry.isIntersecting),{rootMargin:"20px 0px"}):null;
  if(footer)observer?.observe(footer);
  const checkModal=()=>setModalOpen(Boolean(document.querySelector('[role="dialog"], [role="alertdialog"]')));
  checkModal();
  const mutations=new MutationObserver(checkModal);
  mutations.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:["role"]});
  return()=>{observer?.disconnect();mutations.disconnect();};
 },[]);
 return <a className="arc-messenger-float" href={CAMPER_MESSENGER_URL} target="_blank" rel="noopener noreferrer" hidden={nearFooter||modalOpen} aria-label="Message Arkansas Camper Rentals on Messenger (opens in a new tab)"><MessageCircle size={24} aria-hidden="true"/><span>Messenger</span></a>;
}
