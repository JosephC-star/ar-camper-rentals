# ARC Camper Rentals → Michael's Supabase: Safe cutover runbook

## Verified project mapping
- **Current/live:** `gscaqzhdxqwqgynwtpom` in Joe's Supabase organization.
- **New/client-owned:** `unosqzlrigbwwnnpabar` in Arkansas Camper Rentals organization.
- Hosting: **Sites/Cloudflare Workers**, identity in `.openai/hosting.json` must be retained.
- The public camper site is **https://arcamperrentals.com**; private owner UI is `/owner`.
- HomeHuddle tables on the original Supabase project **must not** be moved or deleted.
- Campfire Memories data is maintained separately in Cloudflare D1 and R2. Its owner API authenticates against Supabase and calls `public.is_inventory_owner()`.

## Completed (verified with management connectors)
- New public `inventory` and `inventory_owners` tables with RLS and policies.
- Migrated **77/77** listings; source/destination inventory fingerprints matched immediately afterward.
- New project has one confirmed Auth user matching original inventory owner's login email, and one `inventory_owners` membership.
- Created new project's public `inventory-photos` storage bucket and owner-upload policies.
- Added `public.is_inventory_owner()` as **SECURITY INVOKER**: authenticated role can execute; anonymous role cannot.
- Deployed `camper-photo-migration` Edge Function (version 3), owner-authenticated, with manifest of **65** source files.
- `/owner/setup` password setup and `/owner/migrate` photo migration controls are staged in GitHub branch `camper-auth-migration-setup` (draft PR #2), NOT deployed.
- New endpoint settings are staged in `camper-new-supabase-cutover` (draft PR #3), NOT deployed.

## Required before cutover
1. Deploy and verify the `/owner/setup` and `/owner/migrate` routes through the existing Sites/Cloudflare build process. Merge PR #2 only through the approved Sites workflow; **do not** alter `.openai/hosting.json`.
2. Set the **new** Supabase project's Authentication → URL Configuration → Site URL to `https://arcamperrentals.com/owner/setup` (only after the page is publicly reachable). Add exact URL to allowed Redirect URLs. Verify the recovery email template and auth-flow type. No need to delete the existing confirmed user.
3. Have Michael request a password-reset email for the confirmed login email. Let him set password privately via the working setup page. No passwords, tokens, service-role secrets should be pasted into ChatGPT or GitHub.
4. Open `/owner/migrate`, sign in **to the new Supabase project**, then click Start/Resume. It invokes `camper-photo-migration` repeatedly, transferring a maximum of 4 files per batch. Function now accounts for all 65 stored objects (total about 137.6 MiB) and changes item URL hosts only once all 65 are copied.
5. Check **65** destination bucket objects; check copied inventory photo URLs now reference `unosqzlrigbwwnnpabar`. Check missing photos and errors.
6. Check source inventory hasn't changed since copying (source count/fingerprint vs staging). If it has, reconcile changed rows before deploying cutover.
7. Before production switch, use test build with new project's **public** URL and anon key (no service-role key) and perform functional tests: anonymous catalog, hidden/unavailable visibility, owner sign-in, create/edit/hide/restore/remove test listing, upload test photo; Campfire Memories moderation, approval/rejection, image viewing; mobile category pages; no unexpected D1/R2 changes.
8. Deploy PR #3 with corresponding `NEXT_PUBLIC_INVENTORY_SUPABASE_URL=https://unosqzlrigbwwnnpabar.supabase.co` and new **public anon key** in Sites environment. Environment values override fallback source constants; rebuild. Clear old `inventory-token` tab session by signing out/closing the tab, then sign in afresh.
9. Monitor all categories and admin actions, then remove temporary migration UI and function. Keep old project intact for rollback. If rolling back after new edits, reconcile first, as it could otherwise lose changes.

## Safety and functional considerations
- Existing image paths beginning `/inventory`, `/addons`, or `/inventory-update` remain website assets; do not rewrite or migrate them as Supabase photos.
- While photo migration is in progress, old URLs in the **new** inventory may reference the old project. No production cutover until migration completes.
- Avoid seeding the static original catalog again into the destination; 77 rows have been migrated.
- Storage policy must permit owner SELECT/INSERT/UPDATE for uploads/upserts. Existing public SELECT applies.
- Do not remove the original Supabase project until **both** camper and HomeHuddle dependencies have been independently reviewed. HomeHuddle stays put.
- Any premature removal of the original database could break the live camper website and other apps.
