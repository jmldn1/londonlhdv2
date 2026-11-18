# London LHD Centre v2: project brief

A newer version of the londonlhdcentre.com site, built so AutoGalleria can use
it for London LHD Centre **or adapt it for a different company name**. v1 is
live (since 10 November 2026) and keeps running from
`C:\Users\lhdca\Projects\londonlhd`.

**Timing:** v2 might replace v1, in whole or in part, in the new year (2027).
That isn't a commitment; v2 has to stand on its own either way.

**A copy for LHD Cars Wanted (18 Nov 2026):** lhdcarswanted.co.uk is being
rebuilt in its own project, `C:\Users\lhdca\Projects\lhdcarswanted`, which
started as a copy of this code. This project stays London LHD Centre's. When a
shared part (photo pipeline, /cars, car page, brand system, layout) changes
here, say so, so the user can decide whether to carry it across.

## Built to rebrand

London LHD Centre is the first brand, not part of the code:

- **One brand file** holds the company name, logo, colours, fonts, contact
  details (phone, WhatsApp, email, address, map), opening hours, social links
  and domain.
- **Copy and facts are content, not templates:** services, "40 years", make
  texts, FAQs and legal pages are filled per brand. Nothing like "left hand
  drive" is baked in, so a dealer with a different niche can use it.
- **Theming** through design tokens (CSS variables), so a new brand changes
  colours and fonts without touching pages.
- **Optional features** each brand switches on or off: sell form, cars wanted,
  sold gallery, legacy redirects, blog.
- **No shared data:** each brand has its own database, photos, `.env` and
  email sender.
- A demo brand with a made-up name tests the switch, so nothing quietly depends
  on London LHD Centre.

## Starting points

- **Design ideas:** `C:\Users\lhdca\design-reference\londonlhd-v2\README.md`
  indexes every v2 mockup (homepage concepts, heroes, forms, logo, the
  sold-cars grid and its pop-up). Read it first. File new mockups there and add
  them to that README.
- **v1 as reference:** the live code, its tests, `AGENTS.md` and `docs/` in the
  v1 repo. Reuse what works (image pipeline, spam guards, lead stats,
  redirects, SEO head) rather than re-solving it.
- **Design cues already liked:** Barlow Condensed + Source Sans 3; square
  corners, thin borders, lots of white space; the sold-cars pop-up's clean
  look; logo concept E (steel-blue LONDON over LEFT HAND DRIVE CENTRE).

## Decisions to make before building

1. **Rebuild or evolve:** *decided 11 Nov 2026 with the stack:* a fresh Astro
   codebase, carrying over v1's proven logic (image pipeline, spam guards,
   lead stats, redirects, SEO head) rather than copying v1 page by page.
2. **Stack:** *decided 11 Nov 2026:* **Astro 6** with the Node adapter, under
   PM2 behind nginx on the same VPS; MongoDB and Tailwind 4 stay. v1's Express
   admin can be mounted alongside if it helps. Open to adjustment as we build.
3. **Data:** v2 develops against its own database (never `londonlhd`, the live
   one); how cars, photos and leads move over at the switch.
4. **Scope of the first release:** which pages change first (homepage, /cars,
   car details, sell form), and whether the admin changes.
5. **Wait for v1 data?** The sell form and enquiry pop-up reviews are due
   mid-December to mid-January; their results should shape the v2 forms.

6. **Name:** a product name for the template, separate from London LHD
   Centre (the folder name can change).

## Fixed facts for the London LHD Centre brand (from v1)

- Copy: "left hand drive" with no hyphens; no full stops on headings; only
  client-confirmed facts (40 years; no HPI checks).
- URLs: v1's URLs (/cars, /cars/<make>, /cars/<car>, /sell-your-car and the
  legacy 301s) are indexed by Google. Keep them, or redirect every one.
- Typical stock is about 20 cars: one /cars page, no pagination.

## Photos (direction agreed 11 Nov 2026, adjustable as we go)

- **Show the whole car:** the client prefers seeing the actual photo with as
  little cropped as possible, especially on phones.
- **Never crop when encoding:** sharp keeps every upload whole (fitted inside
  a maximum size, AVIF plus a JPG fallback, encoded in the background after
  upload). Any crop happens only on the page, in CSS, so it can be changed
  later without reprocessing a single photo.
- **Gallery:** a native scroll strip on the car page and PhotoSwipe 5 for full
  screen; no lightGallery (GPLv3) or Swiper.
