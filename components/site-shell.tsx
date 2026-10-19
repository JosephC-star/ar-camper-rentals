"use client";

import {ChevronRight,Flame,Menu,X} from "lucide-react";
import {useState} from "react";

export function SiteHeader(){
 const [open,setOpen]=useState(false);
 return <header className="site-header">
  <a className="brand" href="/"><img className="brand-logo" src="/arkansas-camper-rentals-logo.jpg" alt=""/><span>Arkansas <b>Camper Rentals</b></span></a>
  <button className="menu-button" onClick={()=>setOpen(!open)} aria-label={open?"Close navigation":"Open navigation"} aria-expanded={open}>{open?<X/>:<Menu/>}</button>
  <nav className={open?"nav-links open":"nav-links"} onClick={()=>setOpen(false)}>
   <a href="/">Home</a><a href="/campers">Campers</a><a href="/equipment">Equipment</a><a href="/generators">Generators</a><a href="/addons">Add-ons</a><a href="/drone">Drone photos</a><a href="/miscellaneous">More gear</a><a href="/merchandise">Merchandise</a><a href="/rental-info">Rental info</a>
   <a className="nav-cta" href="mailto:arcamperrentals@gmail.com?subject=Rental%20availability">Check availability <ChevronRight size={17}/></a>
  </nav>
 </header>
}

export function SiteFooter(){return <footer>
 <div className="brand"><img className="brand-logo" src="/arkansas-camper-rentals-logo.jpg" alt=""/><span>Arkansas <b>Camper Rentals</b></span></div>
 <p>Jonesboro, Arkansas</p><a href="mailto:arcamperrentals@gmail.com">arcamperrentals@gmail.com</a>
 <a className="campfire-credit" href="https://clemonswebco.com" target="_blank" rel="noreferrer" aria-label="Crafted around the digital campfire by Clemons Web Co."><span className="campfire-mark" aria-hidden="true"><Flame/></span><span className="campfire-copy"><small>Crafted around the digital campfire by</small><strong>Clemons Web Co.</strong></span><ChevronRight className="campfire-arrow" aria-hidden="true"/></a>
 <a href="/owner" style={{fontSize:12,opacity:.65}}>Owner login</a>
 </footer>}

