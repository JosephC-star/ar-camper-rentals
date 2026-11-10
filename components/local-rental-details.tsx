export default function LocalRentalDetails({listing}:{listing:{localOwner?:boolean;pickupCity?:string}}){
 if(!listing.localOwner)return null;
 return <span className="local-rental-details"><b>Listed by a local owner</b>{listing.pickupCity&&<small>Pickup: {listing.pickupCity}</small>}</span>;
}
