"use client";
import {useEffect,useState} from 'react';
import type {Rental,Addon} from '@/app/page';
export const groups=['Campers','Equipment','Generators','Add-ons','Merchandise','Miscellaneous'] as const;
export type Item={id:string;section:string;category:string;available:boolean;published:boolean;position:number;data:Rental & {category?:string;details?:string[]}};
export const url=process.env.NEXT_PUBLIC_INVENTORY_SUPABASE_URL||'https://unosqzlrigbwwnnpabar.supabase.co';
export const key=process.env.NEXT_PUBLIC_INVENTORY_SUPABASE_ANON_KEY||'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVub3NxemxyaWdid3dubnBhYmFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ3Njg2MzAsImV4cCI6MjExMDM0NDYzMH0.A8FdkweKIca0GYwL48DGpBZqbj9RcqcVHFVRvBL-_60';
export const configured=Boolean(url&&key);
export async function request<T=unknown>(path:string,token?:string,init:RequestInit={}){
 const response=await fetch(`${url}${path}`,{...init,headers:{apikey:key,Authorization:`Bearer ${token||key}`,'Content-Type':'application/json',...init.headers}});
 if(!response.ok){let message='Request failed. Please try again.';try{const body=await response.json() as {msg?:string;message?:string;error_description?:string};message=body.msg||body.message||body.error_description||message}catch{}throw new Error(message)}
 const body=await response.text();return (body?JSON.parse(body):null) as T;
}
export function useInventory<T extends Rental|Addon>(section:string,fallback:T[]){
 const [items,setItems]=useState<T[]>(configured?[]:fallback);
 useEffect(()=>{if(!configured)return;let active=true;request<Item[]>(`/rest/v1/inventory?section=eq.${encodeURIComponent(section)}&published=eq.true&available=eq.true&select=*&order=position.asc,id.asc`).then((rows:Item[])=>{if(active)setItems(rows.map(row=>({...row.data,category:row.category,...(!row.available?{status:'Temporarily unavailable'}:{})}) as unknown as T))}).catch(()=>{/* Do not restore hidden or deleted original listings during an outage. */});return()=>{active=false}},[section]);
 return items;
}
