"use client";
import {equipment} from "@/app/page";
import {useInventory} from "@/lib/inventory";
import RentalCollection from "@/components/rental-collection";
export default function EquipmentPage(){const items=useInventory("Equipment",equipment);return <RentalCollection eyebrow="More ways to rent" title="Haul it. Paddle it. Clean it." intro="Utility trailers, the Master Tow car dolly, watercraft, and pressure washers are available as standalone rentals, with select camper add-on rates where listed." rentals={items} tone="dark"/>}
