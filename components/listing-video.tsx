"use client";
import {useState} from 'react';
import {PlayCircle,ExternalLink,Video,X} from 'lucide-react';
import {youtubeVideoId} from '@/lib/youtube';

type Props={url?:string;title?:string;name:string};
export default function ListingVideo({url,title,name}:Props){
 const id=youtubeVideoId(url);
 // Remember the requested video, rather than a boolean, so changing listings stops playback.
 const [loaded,setLoaded]=useState<{id:string;origin:string}|null>(null);
 if(!id)return null;
 const heading=title?.trim()||'Watch setup & demo';
 const active=loaded?.id===id;
 const parameters=new URLSearchParams({autoplay:'0',playsinline:'1',controls:'1',rel:'0',...(active?{origin:loaded.origin}:{})});
 return <section className="listing-video" aria-label={`${name} video`}><div className="listing-video-inner">
  <div className="listing-video-heading"><span><Video size={17} aria-hidden="true"/>Setup & know-how</span><h3>{heading}</h3><p>A closer look before your adventure.</p></div>
  <div className="listing-video-player">{active?<iframe src={`https://www.youtube-nocookie.com/embed/${id}?${parameters}`} title={`${heading} — ${name}`} referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/>:<button type="button" className="listing-video-load" onClick={()=>setLoaded({id,origin:window.location.origin})} aria-label={`Load ${heading} for ${name}`}><PlayCircle size={48} aria-hidden="true"/><strong>Watch the video</strong><span>Tap to load the YouTube player</span></button>}</div>
  {active&&<div className="listing-video-links"><button type="button" onClick={()=>setLoaded(null)}><X size={14} aria-hidden="true"/>Close video</button><a href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noopener noreferrer">Open on YouTube<ExternalLink size={14} aria-hidden="true"/></a></div>}
 </div></section>;
}
