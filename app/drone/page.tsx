"use client";
import {Camera,ChevronRight,Mail} from "lucide-react";
import {useState} from "react";
import {dronePhotos} from "@/app/page";
import {SiteFooter,SiteHeader} from "@/components/site-shell";

export default function DronePage(){const [showAll,setShowAll]=useState(false);return <main><SiteHeader/>
 <section className="drone-section drone-page"><div className="drone-intro"><span className="kicker light"><Camera size={15}/> A new point of view</span><h1>Drone photography for properties, places, and big moments.</h1><p>Show off land, homes, businesses, events, outdoor destinations, and custom projects from above. Every request is different, so pricing is based on travel, location, and the details of the shoot.</p><div className="drone-actions"><a className="button button-primary" href="mailto:arcamperrentals@gmail.com?subject=Drone%20photography%20quote&body=Tell%20us%20about%20the%20location%2C%20project%2C%20and%20preferred%20date."><Mail size={18}/> Request a custom quote</a><span>Travel and project details determine pricing.</span></div></div><div className="drone-feature"><img src={dronePhotos[1]} alt="Aerial view of an Arkansas valley in autumn"/><div><Camera/><span>Property • Land • Events • Custom requests</span></div></div><div className="drone-gallery">{dronePhotos.slice(0,showAll?dronePhotos.length:6).map((photo,index)=><figure key={photo}><img src={photo} alt={`Drone photography example ${index+1}`}/></figure>)}</div><button className="drone-gallery-toggle" onClick={()=>setShowAll(!showAll)}>{showAll?"Show fewer photos":"View the full 12-photo gallery"}<ChevronRight size={18}/></button></section>
 <section className="explore-more"><span className="kicker">Need rental gear too?</span><h2>Keep planning your next outing.</h2><div><a href="/campers">Campers <ChevronRight/></a><a href="/equipment">Equipment <ChevronRight/></a><a href="/addons">Add-ons <ChevronRight/></a></div></section><SiteFooter/>
 </main>}
