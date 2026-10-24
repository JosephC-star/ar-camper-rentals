"use client";
import {useState} from 'react';
import {RotateCw,MapPin} from 'lucide-react';
import type {Memory} from '@/lib/memories-validation';
export default function MemoryPolaroid({memory,index=0}:{memory:Memory;index?:number}){
 const [flipped,setFlipped]=useState(false);
 return <article className={`memory-polaroid memory-tilt-${index%6}`}><span className="memory-pushpin" aria-hidden="true"/><div className={`memory-flipper ${flipped?'is-flipped':''}`}>
  <div className="memory-face memory-front" aria-hidden={flipped} inert={flipped}><img className="memory-photo" src={`/api/memories/${memory.id}/image`} alt={memory.caption} loading="lazy"/><p className="memory-caption">{memory.caption}</p><small>Pinned by {memory.nickname}</small></div>
  <div className="memory-face memory-back" aria-hidden={!flipped} inert={!flipped}><span className="memory-back-kicker">The story behind the snapshot</span><h2>{memory.caption}</h2><div className="memory-story"><p>{memory.story||'Sometimes the photo says it all. Thanks for bringing our gear along for the adventure!'}</p></div>{memory.gear&&<p className="memory-gear"><MapPin size={15} aria-hidden="true"/>{memory.gear}</p>}<small>— {memory.nickname}</small></div>
 </div><button type="button" className="memory-flip-button" aria-expanded={flipped} aria-label={`${flipped?'Show photo':'Read the story'}: ${memory.caption}`} onClick={()=>setFlipped(!flipped)}><RotateCw size={14} aria-hidden="true"/>{flipped?'Back to the photo':'Flip for the story'}</button></article>;
}
