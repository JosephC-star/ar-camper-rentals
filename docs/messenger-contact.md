# ARC direct Messenger contact

This change adds a shared floating Messenger link, a direct Contact section link and an inline footer link. It does not embed chat, send messages, or change email inquiries, inventory, authentication, data or hosting configuration.

## Verified destination

On 2026-11-25, ARC's existing Facebook share link (`https://www.facebook.com/share/1LnMPTDAh8/`) resolved in the public browser to **Arkansas Camper Rentals**, page ID **61575597212690**. The public page lists `arcamperrentals.com` and `arcamperrentals@gmail.com` and offers Send message.

`https://m.me/61575597212690` resolved to Messenger's login screen preserving conversation target `/t/61575597212690`. This verifies routing to ARC's page, not a signed-in send/delivery test. It is a different page from Jonesboro Party Rentals. The link lives in `lib/contact.ts`.

The standard HTTPS m.me link supports device-native Messenger handling when installed/allowed, with browser fallback; operating-system app handoff was not tested on physical mobile devices. Facebook/Messenger may require customers to sign in. No login credentials or messages were entered or sent.

## Layout and accessibility

The floating link is on public pages using SiteFooter. It uses safe-area-aware bottom-left positioning, a 52px touch target, keyboard focus styling and a descriptive accessible label. It hides while a dialog is mounted and when the footer approaches; the footer provides its own direct link. Mobile shows the icon only; desktop also says Messenger. There is no extra footer spacer or animation.

## Checks

- All 8 existing Node tests pass.
- Application build passes.
- Full TypeScript check reports the same 12 pre-existing unknown-response errors in owner migration/setup pages on both the unchanged baseline and this branch. No new component errors.
- Browser QA results will be recorded in the PR.

Prepared for review; do not merge or publish before visual approval. The existing Sites project and client production resources remain unchanged.

## Preview verification

Desktop browser preview verified all three link hrefs, the floating link at page top, automatic hiding near the footer with its inline link available, and hiding during a real rental details dialog. Existing inventory loaded from its original integration; no records were edited. Preview navigation to Campers and back worked. Physical mobile app handoff and narrow viewport screenshots were not verified in this browser environment.
