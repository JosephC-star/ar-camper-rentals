"use client";
import {useEffect,useState} from 'react';
import type {CSSProperties} from 'react';
const leaves=[
 [7,20,-8,18,'#bb713c'],[23,26,-17,13,'#c38b43'],[42,24,-5,17,'#a85031'],
 [62,29,-22,14,'#c8994c'],[81,22,-12,19,'#b36933'],[94,28,-3,12,'#bd853e'],
 [14,31,-25,12,'#aa5834'],[72,25,-19,15,'#cc9b50']
] as const;
export default function AutumnLeaves(){
 const [paused,setPaused]=useState(false);
 useEffect(()=>{const update=()=>setPaused(document.hidden);update();document.addEventListener('visibilitychange',update);return()=>document.removeEventListener('visibilitychange',update)},[]);
 return <div className={`autumn-leaves${paused?' is-paused':''}`} aria-hidden="true">{leaves.map(([left,duration,delay,size,color],index)=><span className="autumn-leaf-fall" key={index} style={{left:`${left}%`,width:size,height:size,'--leaf-duration':`${duration}s`,'--leaf-delay':`${delay}s`,'--leaf-color':color} as CSSProperties}><svg className="autumn-leaf-sway" viewBox="0 0 40 48" fill="none"><path d={index%2?'M20 3C5 11 2 24 10 34c4 5 9 5 12 3C38 33 38 15 20 3Z':'m20 2 5 11 8-4-2 11 7 3-10 8 2 7-9-3-2 9-2-9-9 3 2-8-8-7 8-3-2-11 8 4Z'} fill="currentColor"/><path d="m20 13-1 31m0-16-8-7m8 12 9-10" stroke="#5b3c23" strokeOpacity=".45" strokeWidth="1.2" strokeLinecap="round"/></svg></span>)}</div>;
}
