# AR Camper Rentals owner inventory

Connected project: https://gscaqzhdxqwqgynwtpom.supabase.co. Owner setup, catalog import, and dashboard flows were verified by the project owner during private preview. Public signups are disabled. The browser configuration contains only the public anon key; permissions are enforced by Supabase RLS.

1. Create a dedicated Supabase project for AR Camper Rentals. Run inventory.sql once in its SQL editor.
2. Disable public signups. Create Michael's verified account for arcamperrentals@gmail.com, using the provider's invitation/password setup flow. Add his auth user UUID to inventory_owners with the commented SQL statement. Do not authorize users based only on an email submitted by the browser.
3. Configure NEXT_PUBLIC_INVENTORY_SUPABASE_URL and NEXT_PUBLIC_INVENTORY_SUPABASE_ANON_KEY in the preview build environment. These are public project settings; never use a service-role key. Rebuild after setting them.
4. Sign in at /owner and import the current catalog before enabling the database on production. Import is repeatable and does not replace edited imported items. Additional gear in the text-only legacy lists remains unchanged and can be entered as individual listings later.
5. Verify: anonymous requests cannot insert/update/delete; a signed-in non-owner cannot edit; an owner can upload, edit, hide, restore, and delete a test item; hidden items never appear in anonymous reads. Test each category page on mobile, then remove the test item. Storage permits only owners to upload JPG/PNG/WebP up to 8 MB.
6. After preview review, connect the same production-approved database configuration and deploy. Configure Supabase email delivery and invitation redirect URLs for the intended website before inviting Michael.

Published rows replace the original listings for each section. When configured, a failed request leaves the catalog empty rather than exposing old, hidden, or deleted listings. Unavailable listings are hidden from public browsing. Owner sessions are scoped to the current browser tab, expire with the provider token, and require sign-in again. No automatic token refresh is implemented.

Removing a photo from a listing does not delete its stored file, preventing accidental loss when cancelling an edit. Unused uploaded files can be cleaned up later in the storage console. No live database operations have been verified until a project is connected.
