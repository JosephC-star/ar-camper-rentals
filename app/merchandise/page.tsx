"use client";
import {useInventory} from "@/lib/inventory";
import type {Rental} from "@/app/page";
import RentalCollection from "@/components/rental-collection";
export default function Page(){const items=useInventory<Rental>("Merchandise",[]);return <RentalCollection eyebrow="Merchandise" title="Merchandise from Arkansas Camper Rentals." intro="Explore our latest arrivals. Contact us for details and availability." rentals={items}/>;}
