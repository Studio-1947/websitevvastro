# Content review required

Compiled from a full-site content correction pass (see summary in the assistant's
final message / PR description). Each item below is something this repository
cannot resolve on its own — a factual, commercial or legal question for the
Studio 1947 team to confirm. Nothing here has been published as a placeholder;
the live pages retain their existing wording until these are resolved.

---

## Homepage

1. **Route:** `/` — `src/components/sections/StatsSection.astro`
   **Claim:** "23+ Creative, measurable results delivered across sectors in our first year."
   **Why confirmation is needed:** The studio's founder bio (`src/generated/about-us/main.html`) states the studio was started in 2025; today's date in this build is 2026-09-17, so the studio is now into its second year. It's unclear whether "23+" and "in our first year" still describe a closed, historical period (2025 only) or need updating to reflect a longer/ongoing period.
   **Evidence/decision required:** Confirm the reporting period for this figure and whether the "first year" framing should be updated or kept as a historical claim.

2. **Route:** `/` — remaining stat counters (65+, 23+, 9+)
   **Claim:** Counted totals for solutions delivered, results, and fellows.
   **Why confirmation is needed:** The brief asked us to verify what each number counts and its reporting period. The descriptions are already appropriately scoped (not labelled "clients" or "projects" without evidence), but we have no source document in the repository (e.g. an internal count, CRM export) to verify the totals themselves.
   **Evidence/decision required:** Confirm each figure against its underlying source, or provide one for future reference.
   **Note:** The workshop-participants counter (previously "200+") was corrected to "35+" per owner confirmation on 2026-09-18.

---

## About page and team

3. ~~**Route:** `/about-us/` — elevation figure~~ — **RESOLVED 2026-09-18.** Owner confirmed the studio is based in Mirik. All four references (`src/components/about/MarkStory.astro`: hero lede, "Elevation" readout, journey lede text, and the journey stage's `ALT` array) now read 1,767 m instead of 2,042 m (Darjeeling town's elevation). Note: 1,767 m is the commonly cited figure for Mirik from general geographic knowledge, not from a document in this repository — worth a quick sanity check against an authoritative source if precision matters here.

4. ~~**Route:** `/about-us/` — Subhendu Kundu's role~~ — **RESOLVED 2026-09-18.** Owner confirmed Subhendu started as an advisor and is now a Co-founder (matching the card label, which was already correct). Bio text updated on both `/about-us/` and `/onlyforlocals/` to say so explicitly instead of calling him "an advisor."

5. **Route:** `/about-us/` — journey section ("The plains": Siliguri, Kalimpong, Gangtok)
   **Claim:** Kalimpong and Gangtok are grouped under "the plains" alongside Siliguri.
   **Why confirmation is needed:** Kalimpong and Gangtok are hill towns, not plains — Siliguri is the plains town in that list. This may be intentional shorthand for "the first stop down from the ridge" rather than a literal geography claim, but it reads as a factual error.
   **Evidence/decision required:** Confirm whether this grouping should be corrected (e.g. relabelling the stop, or moving Kalimpong/Gangtok to a different stage of the journey).

---

## Solutions pages

6. **Route:** `/solutions/research-survey/` — `src/content/solutions/research-survey.json` (svc1)
   **Claim:** Service is named "Diversity, Equality & Inclusion Research."
   **Why confirmation is needed:** The standard, widely recognised term is "Diversity, Equity & Inclusion" (DEI). "Equality" and "Equity" are not interchangeable — the brief explicitly says not to silently swap one for the other since it changes the substantive meaning of the service.
   **Evidence/decision required:** Confirm whether "Equality" is the intended term (a deliberate choice) or should read "Equity."

7. **Route:** `/solutions/research-survey/` — same file (svc2–svc4: Climate Research, Sustainability Research, Tourism Research) and svc7 (Impact Assessment)
   **Claim:** These are listed as capabilities on equal footing with the page's other services.
   **Why confirmation is needed:** Portfolio evidence in this repository supports sustainability- and climate-adjacent work (Village Ways, Nest Homes, Remodel UN, FES India publications) and tourism-adjacent work (homestay projects), but there is no case study demonstrating a dedicated "Impact Assessment" engagement, and the climate/sustainability evidence is mostly adjacent (branding/comms for sustainability-focused clients) rather than research specifically in that domain.
   **Evidence/decision required:** Confirm the team has direct credentials/experience for Impact Assessment specifically, or point to supporting work not yet documented as a case study.

8. **Route:** `/solutions/communication-campaign/`, `/solutions/capacity-building/`, `/solutions/research-survey/`, `/solutions/data-design-tech/` — CTA text
   **Change already made:** "Book a conversation" → "Discuss your project" (English copy), matching the fact that the destination (`/sayhello/`) is a contact form with a stated multi-day reply time, not a live booking/scheduling tool.
   **Why confirmation is needed:** The Hindi/Bengali/Nepali translations for this string (`solutions.shared.bookCall` in `src/i18n/pages/solutions.ts`) still translate the old "Book a conversation" wording, since we could not responsibly produce new translations ourselves.
   **Evidence/decision required:** A translator should update the hi/bn/ne strings for this CTA (or a new key) to match the new English text.

---

## Portfolio and case studies

*(Carried over from the dedicated portfolio review; each item below was already
softened or clarified in the case-study text itself — see the "What changed"
summary — but the underlying figures/claims still need confirmation.)*

9. **Route:** `/work/radha-madhav/` — `src/content/work/radha-madhav.json`
   **Claim:** Sub-100ms billing, 60+ line items processed per minute, a ₹4.8 lakh quarterly revenue increase, and write-offs below 0.5%.
   **Why confirmation is needed:** No supporting measurement methodology, date range, or source exists in the repository. Wording has been softened to describe these as client-reported/system performance figures rather than implying they measure full customer transaction speed, but the figures themselves remain unverified.
   **Evidence/decision required:** Source, measurement period and method for each figure, or explicit confirmation to keep them as published.

10. **Route:** `/work/radha-madhav/` — same file, "Advanced Features Integration" card
    **Claim:** Real-time stock visibility, prescription OCR, and drug-interaction alerts.
    **Why confirmation is needed:** Cannot confirm from repository content alone whether these are shipped/delivered features or planned ones.
    **Evidence/decision required:** Confirm these are live, delivered functionality.

11. **Route:** `/work/mirik-college/` — `src/content/work/mirik-college.json`
    **Claim:** A "60-Hour Framework" (structured as 20+20+20) alongside a separately described "Post-Fieldwork Phase" of "these 20 hours."
    **Why confirmation is needed:** It is ambiguous whether the post-fieldwork phase is one of the three 20-hour blocks already counted in the 60, or an additional 20 hours on top (making the real total 80). Per the brief, we have not guessed.
    **Evidence/decision required:** Confirm the actual total programme hours.

12. **Route:** `/work/kulam-homestay/` — `src/content/work/kulam-homestay.json`
    **Claim:** "Over 85% of homestay enquiries come from mobile users" and a "4.9★ average rating."
    **Why confirmation is needed:** No source, platform, or measurement period is stated for either figure.
    **Evidence/decision required:** Source and period for the mobile-traffic percentage; platform and as-of date for the review rating.

13. **Route:** `/work/awch/` (Avishkar Women & Children Hospital) — `src/content/work/awch.json`
    **Claim (post-edit):** The booking flow is described as "intended to... ease pressure on... reception queues," and the "regional leadership" claim has been removed.
    **Why confirmation is needed:** No queue-reduction measurement exists in the repository to support this as a demonstrated outcome, so it has been kept as a stated design objective rather than a measured result.
    **Evidence/decision required:** Confirm whether queue data exists; if so, restate as a measured result with its source.

14. **Route:** `/work/aicrowd/` — `src/content/work/aicrowd.json`
    **Claim:** "Our work with AIcrowd is the longest technical design relationship in our company's history."
    **Why confirmation is needed:** This is a comparative claim that cannot be verified against other projects' documented history within this repository.
    **Evidence/decision required:** Confirm the comparison is accurate.

15. **Route:** `/work/rajkamal-prakashan/` — `src/content/work/rajkamal-prakashan.json` (scroller media block)
    **Claim:** Three distinct creative captions ("Freedom Sale," "Not on Sale," "New Arrival") share identical alt text describing one specific discount offer (25–40%, 8–23 August).
    **Why confirmation is needed:** This looks like a copy-paste error, but the correct per-image description can't be confirmed without seeing the original artwork.
    **Evidence/decision required:** Correct, distinct alt text for each image from the designer/client.

16. **Route:** `/work/rajkamal-prakashan/` — same file, `year: "Sept, 2025"` field vs. body text referencing "the 2026 National Book Festival in Delhi"
    **Claim:** A single `year` field is shown for an engagement whose body text spans at least two years (an August sale campaign, a book-launch poster, and a 2026 book festival).
    **Why confirmation is needed:** The single date doesn't reflect the actual span of the relationship.
    **Evidence/decision required:** Confirm the actual date range so the case study can show it accurately (a range rather than a single month).

17. **Route:** all case studies with a public view counter (`src/scripts/cardViews.ts`, `/api/views`)
    **Claim/observation:** The brief asked us to consider removing public view counters if they provide no meaningful value.
    **Why confirmation is needed:** This is a product/visible-feature decision (social proof), not a content correction, and is left in place pending a decision.
    **Evidence/decision required:** Owner decision on whether to keep the counters; if removed, whether to also retire the `/api/views` endpoint.

18. **General:** Elegant Sip, Prokritir Group, Sikkim Himal Institute, Bhagyam Arts
    **Claim/observation:** These are described in the brief as needing clear differentiation between ongoing engagements and completed/undocumented case studies.
    **Why confirmation is needed:** Elegant Sip's copy already states the engagement "began in August 2026" with results "to be added as the first season completes" — consistent with an ongoing engagement. We were not able to fully re-verify Prokritir Group, Sikkim Himal Institute and Bhagyam Arts' current engagement status beyond what's already stated in their case files within the time available for this pass.
    **Evidence/decision required:** Confirm current status (ongoing/completed/paused) for each, so the case-study labelling can be kept accurate over time.

---

## Studio 1947 Local (`/onlyforlocals/`)

19. ~~**Route:** `/onlyforlocals/` — `src/pages/onlyforlocals/index.astro`, OTA/listing item — "no commission, ever"~~ — **RESOLVED 2026-09-18.** The commitment itself is unchanged (Studio 1947 still takes no commission on bookings), but the wording is now scoped to what it actually covers: "Free onboarding onto our own booking portal — we never take a commission on bookings made there." This removes the risk of a reader assuming it also covers the OTAs (MakeMyTrip, Booking.com, Agoda, Airbnb) listed in the same line item, which set and keep their own commissions regardless of Studio 1947.

20. **Route:** `/onlyforlocals/` — Website, Booking System and Growth-plan line items
    **Claim/gap:** Revisions policy, hosting/maintenance terms, domain renewal terms after year five, and footage-supply expectations are not stated anywhere on the page.
    **Why confirmation is needed:** The brief says to clarify these only where the repository already confirms specifics; they are currently silent rather than wrong, so nothing was invented.
    **Evidence/decision required:** Supply the actual terms if these should be made explicit to prospective local clients.

---

## Products

21. ~~**Route:** `/products/aangan/` — status~~ — **RESOLVED 2026-09-18.** Owner asked that Aangan not disclose any details for now and show only as "Coming Soon." The product page (`src/content/products/aangan.json`) has been replaced with a minimal placeholder: no live link to aanganerp.in, no feature list, no screenshots, no "already live" claims — just a name, one line, and a "Get notified" contact CTA. The Products index card and header nav entry were trimmed to a generic one-line teaser with no feature specifics. `noindex: true` retained.

22. **Route:** `src/content/products/aangar-erp.json` ("Aangan ERP"), `doptor-campus-manager.json`, `doptor-ngo-manager.json`, `doptor-office-manager.json`
    **Claim/gap:** Four fully-built product pages exist with no entry anywhere in the Products navigation or `/products/` index.
    **Why confirmation is needed:** Unclear whether this is intentional (not yet ready to promote) or an oversight.
    **Evidence/decision required:** Confirm which of these, if any, should be added to the Products menu/index and with what status label.

23. **Route:** Header.astro Products dropdown, `src/generated/products-index/main.html`
    **Claim:** "Social Flow" is listed as "Coming Soon" with no corresponding product page anywhere in `src/content/products/`.
    **Why confirmation is needed:** Currently harmless since the card is not a live link, but if it's ever made clickable it will 404.
    **Evidence/decision required:** Confirm whether Social Flow is still planned; if not, remove the reference.

24. **Route:** URL slug `/products/aangar-erp/` vs. displayed title "Aangan ERP"
    **Claim:** The route slug reads "aangar" while the product name is "Aangan ERP" — likely a legacy typo.
    **Why confirmation is needed:** The brief requires preserving existing URLs, so this has not been renamed (renaming would need a redirect, which is out of scope for a content-only pass).
    **Evidence/decision required:** Confirm whether this should be corrected in a future change that includes a proper redirect.

---

## Careers

25. ~~**Route:** `/careers/instagram-influencer/` — future-dated posting~~ — **RESOLVED 2026-09-18.** Owner asked for the Social Media Influencer listing to be removed from Careers entirely. Deleted `src/content/careers/instagram-influencer.json`, its card on `/careers/`, its cross-listing card on the other five role pages, and its orphaned `careers.title.socialMediaInfluencer` translation key. The route no longer builds (verified: 100 pages instead of 101).

26. **Route:** `/careers/communication/`, `/careers/software-engineer/` — `src/content/careers/communication.json`, `src/content/careers/software-engineer.json`
    **Claim:** Both roles list their location as "On-Site, Plassey, Nadia" (West Bengal), while all other listed roles — and, notably, these same two pages' own apply-sidebar widget — say "On-Site, Mirik, Darjeeling."
    **Why confirmation is needed:** This looks like a copy/paste error but has not been resolved by guessing.
    **Evidence/decision required:** Confirm the correct work location for these two roles.

27. **Route:** `/careers/communication/` — `src/content/careers/communication.json`
    **Claim:** Role title is simply "Communication" — a department label rather than a specific job title.
    **Why confirmation is needed:** No confirmed alternative title exists elsewhere in the repository, so nothing has been invented.
    **Evidence/decision required:** Confirm the actual role title (e.g. "Communication Associate," "Communication Executive").

---

## Contact and policy pages

28. ~~**Route:** `/sayhello/` vs. `/privacy-policy/`, `/terms-of-service/`, `/accessibility-statement/` — email inconsistency~~ — **RESOLVED 2026-09-18.** Owner confirmed `studio@1947.io` as the single canonical address. All three legal pages (previously `hello@1947.io`) now use `studio@1947.io`, matching the contact page and careers listings.

29. **Route:** `/privacy-policy/`, `/terms-of-service/`
    **Claim:** These pages describe collecting a "password" and information "during registration," and the Terms of Service has a "Registration / Form Fillup" section, but no login, sign-up or account feature exists anywhere on the site (verified: no such routes under `src/pages`).
    **Why confirmation is needed:** This reads as unmodified legal boilerplate that doesn't match the site's actual functionality (enquiry forms only, no accounts). We have not rewritten legal clauses ourselves.
    **Evidence/decision required:** Legal owner to revise the scope of these clauses to match what the site actually does.

30. ~~**Route:** `/privacy-policy/`, `/terms-of-service/`, `/labour-employment-policy/` — operating entity name~~ — **PARTIALLY RESOLVED 2026-09-18.** Owner supplied the entity name "WBIN 1947 Studio LLP," based in Mirik, West Bengal, India. Added to the opening paragraph of all three policies, and the Terms of Service "Governing Law" clause now names India as the governing law and "the courts having jurisdiction over Mirik, West Bengal" for disputes, replacing the vague "jurisdiction in which we operate."
    **Still open:** The entity name as given ("WBIN 1947 Studio LLP") has not been cross-checked against any registration document — please confirm the exact legal name and registration/CIN/LLPIN number if one should be quoted. The accessibility statement's ambiguous date format ("05/06/2026") and the general absence of unambiguous "last updated" dates on the other policies remain unresolved.

31. **Route:** `/accessibility-statement/`
    **Claim:** States the studio "appl[ies] the relevant accessibility standards" without naming a specific standard or conformance level (e.g. a WCAG version/level).
    **Why confirmation is needed:** We have deliberately not added a specific standard or conformance level, since none is confirmed as having been audited against.
    **Evidence/decision required:** Confirm whether an accessibility audit has been performed and to what standard, before any specific conformance claim is added.

---

## Notes on scope not fully covered in this pass

- **Blog/Insights**: a representative sample of articles was reviewed for generic intros, repetition, and reading-time accuracy (reading times were corrected against a standard 200 wpm convention — see commit history for the list of files touched); not every article in the collection was individually re-read in full.
- **Initiatives/Workshops/Fellowship**: `/initiatives/` was edited to reduce defensive charity/CSR framing and recruitment-pipeline language; `/local-design/`, `/workshops/` and `/fellowship/` were reviewed and found to already meet the brief's standard (access/participation-led framing, no patronising language, no invented eligibility/dates) with no further changes made.
