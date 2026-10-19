"use client";
import {useInventory} from "@/lib/inventory";
import type {Rental} from "@/app/page";
import RentalCollection from "@/components/rental-collection";
export default function Page(){const items=useInventory<Rental>("Miscellaneous",[]);return <RentalCollection eyebrow="Miscellaneous" title="More gear for your next adventure." intro="Explore our latest arrivals. Contact us for details and availability." rentals={items}/>;}
