# London LHD Centre v2: project brief

The next version of londonlhdcentre.com, for AutoGalleria's client London LHD
Centre. v1 is live (since 10 November 2026) and keeps running from
`C:\Users\lhdca\Projects\londonlhd` until v2 is ready to replace it.

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

1. **Rebuild or evolve:** a fresh codebase, or a copy of v1 reworked page by
   page.
2. **Stack:** keep Node/Express/EJS/Tailwind/MongoDB (one team, one VPS, same
   admin) or change it.
3. **Data:** v2 develops against its own database (never `londonlhd`, the live
   one); how cars, photos and leads move over at the switch.
4. **Scope of the first release:** which pages change first (homepage, /cars,
   car details, sell form), and whether the admin changes.
5. **Wait for v1 data?** The sell form and enquiry pop-up reviews are due
   mid-December to mid-January; their results should shape the v2 forms.

## Fixed facts (from v1)

- Copy: "left hand drive" with no hyphens; no full stops on headings; only
  client-confirmed facts (40 years; no HPI checks).
- URLs: v1's URLs (/cars, /cars/<make>, /cars/<car>, /sell-your-car and the
  legacy 301s) are indexed by Google. Keep them, or redirect every one.
- Typical stock is about 20 cars: one /cars page, no pagination.
