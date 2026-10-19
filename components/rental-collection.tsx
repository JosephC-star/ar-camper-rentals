"use client";

import {BedDouble,Camera,Check,ChevronLeft,ChevronRight,Clock,TentTree,X} from "lucide-react";
import {useState} from "react";
import type {Rental} from "@/app/page";
import {RentalCard} from "@/app/page";
import {SiteFooter,SiteHeader} from "@/components/site-shell";
import {Dialog,DialogContent,DialogDescription,DialogHeader,DialogTitle} from "@/components/ui/dialog";

type Props={eyebrow:string;title:string;intro:string;rentals:Rental[];tone?:"light"|"dark";note?:string};

export default function RentalCollection({eyebrow,title,intro,rentals,tone="light",note}:Props){
 const [selected,setSelected]=useState<Rental|null>(null);const [photoIndex,setPhotoIndex]=useState(0);
 const movePhoto=(direction:number)=>selected&&setPhotoIndex((photoIndex+direction+selected.photos.length)%selected.photos.length);
 return <main><SiteHeader/>
  <section className={`page-hero ${tone==="dark"?"page-hero-dark":""}`}><div><span className="kicker">{eyebrow}</span><h1>{title}</h1><p>{intro}</p></div></section>
  <section className={`catalog-page ${tone==="dark"?"catalog-page-dark":""}`}>{note&&<div className="generator-rate-note"><strong>Standalone rentals available</strong><span>{note}</span></div>}{!rentals.length&&<p role="status">No listings to show right now. Please contact us for current availability.</p>}<div className="catalog-page-grid">{rentals.map(rental=><RentalCard key={rental.name} rental={rental} onOpen={()=>{setPhotoIndex(0);setSelected(rental)}}/>)}</div></section>
  <section className="explore-more"><span className="kicker">Keep exploring</span><h2>Find the rest of your setup.</h2><div><a href="/campers">Campers <ChevronRight/></a><a href="/equipment">Equipment <ChevronRight/></a><a href="/generators">Generators <ChevronRight/></a><a href="/addons">Add-ons <ChevronRight/></a></div></section>
  <SiteFooter/>
  <Dialog open={Boolean(selected)} onOpenChange={open=>!open&&setSelected(null)}><DialogContent className="rental-dialog">{selected&&<><button className="modal-close" onClick={()=>setSelected(null)} aria-label="Close"><X/></button><div className="dialog-gallery">{selected.photos.length?<><img src={selected.photos[photoIndex]} alt={`${selected.name}, photo ${photoIndex+1} of ${selected.photos.length}`}/>{selected.photos.length>1&&<><button className="photo-prev" onClick={()=>movePhoto(-1)} aria-label="Previous photo"><ChevronLeft/></button><button className="photo-next" onClick={()=>movePhoto(1)} aria-label="Next photo"><ChevronRight/></button><span className="photo-count"><Camera size={15}/>{photoIndex+1} / {selected.photos.length}</span></>}</>:<div className="photo-placeholder"><TentTree/><span>Photos coming soon</span></div>}</div><div className="dialog-content"><DialogHeader><DialogDescription>{selected.type}</DialogDescription><DialogTitle>{selected.name}</DialogTitle></DialogHeader><p className="dialog-summary">{selected.summary}</p><div className="dialog-stats"><span><Clock/>{selected.rate}</span>{selected.sleeps&&<span><BedDouble/>{selected.sleeps}</span>}</div><div className="feature-list">{selected.features.map(feature=><span key={feature}><Check/>{feature}</span>)}</div><div className="dialog-bottom"><div><small>Starting rate</small><strong>{selected.rate}</strong></div><div className="dialog-actions"><a className="addon-button" href="/addons">Browse add-ons</a><a className="inquiry-button" href={`mailto:arcamperrentals@gmail.com?subject=${encodeURIComponent(selected.name+" rental question")}`}>Ask about this rental</a></div></div></div></>}</DialogContent></Dialog>
 </main>
}
