"use client";

import {useState} from 'react';
import {Check,Copy,Mail,Share2,TentTree} from 'lucide-react';

const website='https://arcamperrentals.com';
const inquiry='mailto:arcamperrentals@gmail.com?'+new URLSearchParams({
 subject:'Rental inquiry — $20 website-share offer',
 body:"Hello,\n\nI’m interested in the $20 website-share offer.\n\nRental: \nPreferred dates: \n\nI’ll attach a screenshot of my post sharing https://arcamperrentals.com. Please confirm whether this rental is eligible.\n\nThank you!"
}).toString();

export default function ShareOffer(){
 const [copyStatus,setCopyStatus]=useState<'idle'|'copied'|'manual'>('idle');
 async function copyLink(){try{await navigator.clipboard.writeText(website);setCopyStatus('copied')}catch{setCopyStatus('manual')}}
 return <section className="share-offer-wrap" aria-labelledby="share-offer-heading">
  <div className="share-offer">
   <div className="share-offer-stamp"><TentTree size={24} aria-hidden="true"/><span>SHARE & SAVE</span><strong><sup>$</sup>20</strong><small>OFF AN ELIGIBLE RENTAL</small></div>
   <div className="share-offer-copy"><span className="kicker">Good trips are worth sharing</span><h2 id="share-offer-heading">Pass along the adventure.</h2><p>Share <strong>arcamperrentals.com</strong> in a Facebook or other social media post, then email a screenshot with your rental inquiry to get <strong>$20 off an eligible camper or trailer rental.</strong></p>
    <div className="share-offer-actions"><a className="offer-share-button" href={'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(website)} target="_blank" rel="noopener noreferrer"><Share2 size={16} aria-hidden="true"/>Share on Facebook</a><a className="offer-email-button" href={inquiry}><Mail size={16} aria-hidden="true"/>Email your inquiry</a><button type="button" className="offer-copy-button" onClick={copyLink}>{copyStatus==='copied'?<Check size={15} aria-hidden="true"/>:<Copy size={15} aria-hidden="true"/>}{copyStatus==='copied'?'Link copied':'Copy website link'}</button></div>
    <span className="offer-copy-status" role="status">{copyStatus==='copied'?'Website link copied. Share it in your post.':copyStatus==='manual'?'Copy this link: https://arcamperrentals.com':''}</span>
    <p className="share-offer-fineprint">Camper and trailer rentals only. Items priced $20 or less are excluded. Attach your screenshot before sending your inquiry. Ask us to confirm coupon eligibility.</p>
   </div>
  </div>
 </section>;
}
