"use client";
import {campers} from "@/app/page";
import {useInventory} from "@/lib/inventory";
import RentalCollection from "@/components/rental-collection";
export default function CampersPage(){const items=useInventory("Campers",campers);return <RentalCollection eyebrow="Find your basecamp" title="Campers with a little more character." intro="From lightweight couples’ campers to a rooftop tent and an unforgettable retro Shasta, every getaway has its own personality." rentals={items}/>}
