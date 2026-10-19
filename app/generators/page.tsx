"use client";
import {generators} from "@/app/page";
import {useInventory} from "@/lib/inventory";
import RentalCollection from "@/components/rental-collection";
export default function GeneratorsPage(){const items=useInventory("Generators",generators);return <RentalCollection eyebrow="Portable power, your way" title="Generators for camp—or anywhere you need power." intro="Every generator can be rented by itself. Pair one with a camper rental to unlock the discounted camper add-on rate." rentals={items} note="Prices show the lowest available starting rate. Open any generator to compare standalone, half-day, and camper-package pricing."/>}
