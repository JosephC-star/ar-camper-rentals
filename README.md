# Arkansas Camper Rentals

Website and owner inventory dashboard for https://arcamperrentals.com.

## Owner workflow

Open `/owner` (also linked discreetly in the footer) and sign in with the owner account. Add or edit a listing, select its category, upload photos, and save. Enable both **Show on website** and **Available for inquiries** to display a listing. Hide a listing to retain it without showing it publicly. Delete requires explicit confirmation. On mobile the save button stays visible while editing. Password changes verify the current password and test a new sign-in before showing success.

**Import current catalog** seeds the original photo listings without overwriting existing imported entries. Text-only legacy additional gear remains in the add-ons page and can be entered as individual listings as needed. Do not re-enable public signups.

## Hosting and development

The custom domain is currently connected to Sites / Cloudflare Workers. GitHub retains the release source. Do not point a Netlify build at the Worker output; a separate Netlify-compatible build is required for any future hosting migration.

Install dependencies with the supplied installer, run `npm run dev`, and build with the documented Sites workflow. `.openai/hosting.json` retains the live site's identity; never replace it with the private test site's identity.

Supabase schema and access setup are documented in `supabase/SETUP.md`. Only public project settings may appear in browser code. Never commit a database password, owner password, service-role key, or deployment token.

## Share offer

The homepage voucher advertises $20 off eligible camper or trailer rentals after sharing the production website URL and emailing a screenshot with an inquiry. Items priced $20 or less are excluded. Michael confirms eligibility; the site does not automatically apply a payment discount.
