"use client";
import {addonCategories,addons,moreAddonGroups} from "@/app/page";
import {useInventory} from "@/lib/inventory";
import AddonCollection from "@/components/addon-collection";
export default function AddonsPage(){const items=useInventory("Add-ons",addons);return <AddonCollection addons={items} categories={[...addonCategories,"Miscellaneous"]} moreGroups={moreAddonGroups}/>}
