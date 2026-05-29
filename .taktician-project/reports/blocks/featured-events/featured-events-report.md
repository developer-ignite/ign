# Featured Events Block Report

**Date:** 2026-02-20 00:40 PST

**Test Page:** [https://ign.localhost/test-featured-events/](https://ign.localhost/test-featured-events/)

**Figma Source:**
- [Desktop](https://www.figma.com/design/bpRK9A1l2nTbWfMg1pX5yK/IGN-%7C-WEBSITE--INTERNAL-?node-id=1215-17607&m=dev)

---

## Requirements

### User Requirements
- [x] Display events from The Events Calendar plugin with automatic or manual selection
- [x] Support future and past events with appropriate sorting (future ASC, past DESC)
- [x] Vertically stacked event card layout (not a carousel)
- [x] Two-panel event card design with image on left, content on right
- [x] Date badge with day, date, and month/year information
- [x] Editable section heading with optional eyebrow and description
- [x] Event title, location, and description in each card
- [x] Customizable call-to-action button label
- [x] Event category and tag filtering support
- [x] Post limit control (1-20 events)
- [x] Hide section if no events found (hideIfEmpty option)

### Block Type Requirements
- [x] Dynamic content query with automatic and manual selection modes
- [x] Server-side rendering with FilteredServerSideRender for editor preview
- [x] ThemeHeading component for section header with eyebrow, heading, description
- [x] Taxonomy multi-select controls for filtering
- [x] Post selector for manual event selection
- [x] Semantic HTML structure with proper heading hierarchy
- [x] Accessible link targets and image alt text
- [x] Responsive layout adapting to mobile, tablet, and desktop viewports

---

## Block Behavior

The Featured Events block displays a curated list of events from The Events Calendar plugin in a clean, stacked vertical layout. The section header appears on the page background (light/beige), while each event card displays with a dark textured background pattern for visual distinction.

**Section Header:** The block begins with an optional eyebrow label (uppercase, small text) followed by a required main heading (headingSize: 2, which renders at 48px mobile and 60px desktop). A sidebar description appears to the right of the heading on desktop, moving below the heading on mobile. All header text is editable via the block settings. The header area has no dark background—it sits on the page background like normal content.

**Event Selection:** Editors can choose between two modes:
- **Automatic mode** (default) queries events based on filters: future events show upcoming dates in chronological order, past events show most recent first. Editors set a limit (default 3, range 1-20) and optionally filter by event category or tag.
- **Manual mode** allows hand-picking specific events in a specific order via a post selector.

**Event Cards:** Each event displays as a two-panel card with dark pattern backgrounds on both halves:
- **Image panel** (left side on desktop, top on mobile): Featured image with a date badge positioned at the top-right corner via flex layout (ml-auto), displaying day of week, day number (40px), and month/year. The badge sits naturally within the frame padding (8px p-2). Both the outer card and inner frame have rounded corners. The background uses a dark textured pattern. The image maintains a 4:3 aspect ratio (aspect-[4/3]) at all breakpoints, providing consistent proportional image sizing from mobile through desktop.
- **Content panel** (right side on desktop, bottom on mobile): Event title in natural title case (not uppercase), at 48px desktop (md:text-[3rem]), venue/location information, event description excerpt, and a "View Event" button with a right-pointing arrow icon (customizable label). The button hover state shows the theme's accent color via group-hover. The entire card is clickable, linking to the event's detail page. The button is anchored to the bottom of the content panel using a dual-mechanism approach: `justify-between` on the content half (flex flex-col justify-between) distributes the text content group to the top and the button to the bottom when the content panel has sufficient height (which it does on desktop where the image panel's 4:3 aspect ratio sets the row height). On mobile where the image is smaller, `mb-6` on the text group provides a 24px minimum gap buffer. Both utilities work together across all breakpoints to maintain consistent button spacing. The background uses the same dark textured pattern as the image panel. Card height is content-driven (no fixed height).

**Typography details:** The day number in the date badge renders at 40px (Anton font). Event titles render in Anton font at 48px on desktop. The date badge labels and venue text render at 16px. All heading elements use the Anton font family.

**Responsive behavior:** On mobile (below 768px), cards stack vertically with the image on top (4:3 aspect ratio) and content below. Card height is content-driven. At tablet width (768px) and above, cards display side-by-side with consistent 4:3 image aspect ratio. The date badge remains at the top-right of the image on all breakpoints. Button spacing from text content remains consistent via mb-6 at all viewport sizes.

**Empty states:** If no events match the query (manual mode with no selections, or automatic mode with no results), the section hides entirely when hideIfEmpty is enabled, or shows the header only when disabled.

**Conditional content:** Venue names display only when associated with an event. The eyebrow and sidebar description are optional and hide when left empty.

---

## Development Notes

**Card Title Desktop Override (md:text-[3rem]):** The event title uses text-header-2 for the base mobile value (48px), but includes md:text-[3rem] on desktop to lock it at 48px per Figma specification. Without this override, text-header-2 would scale to 60px at larger breakpoints via the theme's responsive system. The explicit 48px override ensures design fidelity on desktop while retaining the heading utility on mobile.

**Date Badge Flex Positioning (flex flex-col items-end):** The date badge is positioned at the top-right corner of the image frame using flex column layout (flex flex-col items-end) instead of absolute positioning. The badge is a natural flex child with ml-auto, which pushes it to the right edge and items-end aligns it to the end of the flex column (top), creating the top-right placement. The image itself is absolutely positioned behind the badge (absolute inset-0).

**CTA Hover State (group-hover:text-[var(--accent-color)]):** The btn-tertiary button uses group-hover to change text color to the theme's accent color (neon green) when the card is hovered. The parent anchor carries the group class, enabling the group-hover pattern across the entire card link. This creates a visual affordance for the clickable card area.

---

## Issues to Address

No unresolved issues. All critical and major issues identified during QA have been resolved.

---

## Test Results

### Validation Summary

| Check | Status | Notes |
|-------|--------|-------|
| Build | PASS | Compiles without TypeScript or lint errors in FeaturedEvents files |
| Block Registration | PASS | block.json valid with all 12 attributes correctly typed and defaulted |
| TSX/PHP Sync | PASS | All validation checks pass: no $attributes[] extraction, docblocks present, attribute usage consistent, className in blockProps correct |
| ThemeHeading Size | PASS | Revision 2: headingSize changed from 3 to 2, renders at 48px mobile / 60px desktop for section heading |
| Card Title | PASS | Revision 2: h3 no longer has uppercase class, renders in natural title case at 48px desktop (md:text-[3rem]), 48px mobile |
| Date Badge Position | PASS | Revision 2: Uses flex flex-col items-end with ml-auto (no absolute), positioned at top-right corner of image frame |
| Card Height | PASS | Revision 2: Removed md:h-[349px] fixed height, cards are now content-driven |
| Image Aspect Ratio | PASS | Revision 3: Image maintains aspect-[4/3] at all breakpoints (removed md:aspect-auto md:h-full), consistent proportional sizing |
| CTA Spacing | PASS | Revision 4: Restored justify-between on content half + mb-6 on text group (dual mechanism: justify-between distributes button to bottom on desktop where image aspect ratio sets height; mb-6 provides minimum 24px gap on mobile) |
| Button Hover | PASS | group-hover:text-[var(--accent-color)]! shows accent color on hover |
| Card Backgrounds | PASS | Both image half and content half use bg-dark-pattern (dark textured backgrounds) |
| Arrow Icon | PASS | Arrow icon renders via btn-tertiary-arrow span with theme_asset('images/tertiary-arrow.svg') on all event CTAs |
| Venue Rendering | PASS | 3 tribe_venue posts seeded (Vancouver Convention Centre, Rogers Arena, BC Place Stadium), associated via \_EventVenueID meta, venue names rendering |
| Event Query & Ordering | PASS | Future events sorted ASC, past events sorted DESC by \_EventStartDate meta key; taxonomy filters working |
| Accessibility | PASS | All images have alt text, proper heading hierarchy, date badge aria-hidden, card links accessible, venue conditional rendering |
| Cross-Browser | PASS | Chromium, Firefox, WebKit render identically across all breakpoints (375px, 768px, 1024px, 1440px) |

### Screenshots

**Chromium (Primary Browser)**

![Mobile (375px)](screenshots/2026-02-20-003625/featured-events-chromium-375w.png)
![Tablet (768px)](screenshots/2026-02-20-003625/featured-events-chromium-768w.png)
![Desktop (1024px)](screenshots/2026-02-20-003625/featured-events-chromium-1024w.png)
![Desktop (1440px)](screenshots/2026-02-20-003625/featured-events-chromium-1440w.png)

**Firefox**

![Mobile (375px)](screenshots/2026-02-20-003625/featured-events-firefox-375w.png)
![Tablet (768px)](screenshots/2026-02-20-003625/featured-events-firefox-768w.png)
![Desktop (1024px)](screenshots/2026-02-20-003625/featured-events-firefox-1024w.png)
![Desktop (1440px)](screenshots/2026-02-20-003625/featured-events-firefox-1440w.png)

**WebKit (Safari)**

![Mobile (375px)](screenshots/2026-02-20-003625/featured-events-webkit-375w.png)
![Tablet (768px)](screenshots/2026-02-20-003625/featured-events-webkit-768w.png)
![Desktop (1024px)](screenshots/2026-02-20-003625/featured-events-webkit-1024w.png)
![Desktop (1440px)](screenshots/2026-02-20-003625/featured-events-webkit-1440w.png)

### Test Cases

| Scenario | Status | Notes |
|----------|--------|-------|
| Automatic - Future Events | PASS | Default configuration shows 3 upcoming events sorted by date ascending (Mar 10, Apr 22, Jun 18) |
| Automatic - Past Events | PASS | Toggle to past events shows them sorted descending by date (Jan 15, Dec 5) |
| Manual Selection | PASS | Hand-picked events display in selected order with custom button label |
| Minimal Fields | PASS | Only heading provided; eyebrow and description hide gracefully |
| Long Content | PASS | Extended heading and description text wrap correctly without overflow |
| Single Event | PASS | Limit of 1 correctly shows one event |
| Hide If Empty | PASS | Section hides when no events found and hideIfEmpty=true; shows heading only when false |

### What Matched

**Layout & Structure**
- [x] Section background is page default (light/beige) — no dark overlay
- [x] Section header with two-column layout (heading left, description right on desktop)
- [x] Vertically stacked event cards with consistent spacing
- [x] Two-panel card design with image on left, content on right (desktop)
- [x] Mobile responsive stacking (cards vertical on mobile)
- [x] Dark pattern textured background (#1f1f1d with texture) on both card halves
- [x] Dark pattern backgrounds visible on both image and content panels
- [x] Rounded corners on card halves (24px, near-exact to Figma's 25px)

**Typography**
- [x] Section heading uses Anton font at text-header-2 scale (headingSize: 2, 48px mobile / 60px desktop)
- [x] Event card title uses Anton font in natural title case (not uppercase) at 48px desktop (md:text-[3rem]), 48px mobile
- [x] Day number in date badge uses Anton font at 40px (text-[2.5rem], exact Figma match)
- [x] Body text (location, description) uses General Sans Medium, 16px, line-height 1.5
- [x] Date badge labels use sans-serif Medium, 16px (General Sans per theme, Roboto shown in Figma)
- [x] Eyebrow uppercase, small (14px, text-sm)

**Colors & Styling**
- [x] Card halves use bg-dark-pattern (charcoal #1f1f1d with texture overlay)
- [x] Text colors white (text-white) on dark backgrounds
- [x] Date badge background charcoal (#1f1f1d) for contrast against dark-pattern image
- [x] Border radius 24px rounded-3xl on card halves (Figma 25px, 1px within Tailwind)
- [x] Inner image frame border radius 12px (rounded-xl)
- [x] Date badge border radius 8px (rounded-lg)
- [x] Button styling matches theme btn-tertiary component with arrow icon (svg via theme_asset)
- [x] All color tokens from theme (no hardcoded hex values in block code)

**Spacing & Sizing**
- [x] Section container padding 64px vertical (py-16)
- [x] Header to cards gap 64px (mb-16)
- [x] Inter-card gap 24px (gap-6)
- [x] Image panel padding 16px (p-4)
- [x] Inner frame padding 8px (p-2) with badge positioned via flex layout (ml-auto, naturally top-right)
- [x] Content panel padding 24px (p-6)
- [x] Date badge width 104px, padding 12px vertical / 4px horizontal (py-3 px-1)
- [x] Card height content-driven (no fixed height)
- [x] Image aspect ratio 4:3 consistently at all breakpoints (aspect-[4/3]), no responsive override
- [x] Content items gap 8px (gap-2)
- [x] Text-to-button spacing 24px (mb-6) — fixed margin below text content group

**Responsive Design**
- [x] All breakpoints working: 375px mobile, 768px tablet, 1024px, 1440px desktop
- [x] Card layout transition at md breakpoint (768px)
- [x] Header layout adjustment on mobile
- [x] Date badge positioned at top-right on all breakpoints via flex column layout
- [x] Image maintains consistent 4:3 aspect ratio at all breakpoints
- [x] Event title locked at 48px on desktop (md:text-[3rem]) per Figma specification
- [x] CTA button spacing consistent at all breakpoints via mb-6
- [x] Cross-browser consistency: Chromium, Firefox, WebKit all render identically

---

## Changelog

| Timestamp | Change |
|-----------|--------|
| 2026-02-19 16:05 PST | Design structural analysis complete — block composition identified |
| 2026-02-19 16:09 PST | Planning complete — full spec generated, 7 test variations defined |
| 2026-02-19 16:14 PST | Block implementation complete — 6 files created (block.json, TSX, PHP, SVG, + card template part), build passing, test page with 7 variations verified |
| 2026-02-19 16:17 PST | Initial functional QA found 2 major issues: FQA-001 (no event data), FQA-002 (false positive on height class) |
| 2026-02-19 19:32 PST | Seeded 5 tribe_events with featured images, resolved FQA-001; confirmed FQA-002 as false positive |
| 2026-02-19 19:33 PST | Functional QA complete — all 11 checks pass, 0 issues, event cards rendering correctly across all variations |
| 2026-02-19 19:37 PST | Design QA complete — full visual comparison across 4 breakpoints x 3 browsers, 0 issues, 4 informational notes (design system conventions), all screenshots captured |
| 2026-02-19 20:33 PST | Revision 1: All 6 user-requested fixes applied — (1) removed section-wide dark background, now only card halves have bg-dark-pattern, (2) repositioned date badge inside inner image frame at 8px inset (top-2 right-2), (3) changed card backgrounds from bg-charcoal to bg-dark-pattern with texture, (4) added arrow icon to btn-tertiary CTA via theme_asset, (5) corrected font sizes to day number 40px (text-[2.5rem]) and event title 48px base (text-header-2), (6) seeded 3 tribe_venue posts (Vancouver Convention Centre, Rogers Arena, BC Place Stadium) and associated with test events via \_EventVenueID meta |
| 2026-02-19 20:34 PST | Functional QA (Revision 1): All 10 checks pass, all 6 fixes verified, no regressions from prior run, cross-browser consistency confirmed (375px and 1440px tested) |
| 2026-02-19 20:40 PST | Design QA (Revision 1): All 6 fixes verified, full visual comparison across 4 breakpoints x 3 browsers passed, 1 note-level observation about responsive heading scale-up (event title 48px→60px at >=768px via theme's text-header-2 utility), all screenshots captured |
| 2026-02-19 23:53 PST | Revision 2: All 6 user-requested fixes applied — (1) ThemeHeading headingSize changed from 3 to 2 (section heading now 48px mobile / 60px desktop), (2) removed uppercase class from card title h3 (renders in natural title case), (3) date badge repositioned using flex flex-col items-end with ml-auto (top-right positioning via flex layout), (4) button hover changed to group-hover:text-[var(--accent-color)]! (accent color on hover), (5) removed md:h-[349px] fixed height from card anchor (content-driven height), (6) added aspect-[4/3] mobile with md:aspect-auto md:h-full desktop to image container |
| 2026-02-19 23:54 PST | Functional QA (Revision 2): 9/9 checks pass, all 6 REV2 fixes verified with mandatory screenshots, no regressions from prior runs |
| 2026-02-20 00:02 PST | Design QA (Revision 2): 2 issues found (DQA-001: card title 60px should be 48px desktop, DQA-002: date badge positioned bottom-right should be top-right), developer fixes applied |
| 2026-02-20 00:05 PST | Developer fix (DQA issues): (DQA-001) added md:text-[3rem] md:leading-[1.1] to card title for 48px desktop lock, (DQA-002) changed flex items-end to flex flex-col items-end for top-right badge positioning |
| 2026-02-20 00:07 PST | Design QA (Post-fix verification): All 2 DQA issues resolved, full visual comparison across 4 breakpoints x 3 browsers passed, card title now 48px desktop per Figma, date badge top-right, all 12 final screenshots captured |
| 2026-02-20 00:20 PST | Revision 3: 2 fixes applied — (1) image aspect ratio changed from aspect-[4/3] md:aspect-auto md:h-full to aspect-[4/3] consistently at all breakpoints (removed responsive override that caused image to be too small on desktop), (2) content half spacing improved by removing justify-between and adding mb-6 to text content group (24px gap before button instead of no gap) |
| 2026-02-20 00:21 PST | Functional QA (Revision 3): 7/7 checks pass, both fixes verified — image 4:3 aspect ratio confirmed at all breakpoints (1440px and 375px), CTA spacing from text visible in screenshots, no regressions |
| 2026-02-20 00:23 PST | Design QA (Revision 3): Both fixes verified, card proportions now match Figma with substantial 4:3 image rectangle, button spacing correct across all 4 breakpoints and 3 browsers, all 12 final screenshots captured |
| 2026-02-20 00:35 PST | Revision 4: 1 fix applied — restored `justify-between` to content half div (flex flex-col justify-between). With the image aspect-[4/3] setting the card height on desktop, justify-between now works to distribute the text group to the top and button to the bottom. On mobile where justify-between has less room, mb-6 on the text group continues providing a 24px minimum gap buffer. |
| 2026-02-20 00:36 PST | Functional QA (Revision 4): 5/5 checks pass, fix verified — justify-between present on content half in all event-bearing sections, button anchored to bottom of content panel with clear visible gap on desktop (1440px), mb-6 on text group retained for mobile, code review + DOM + visual screenshots confirm correct implementation, no regressions |
| 2026-02-20 00:39 PST | Design QA (Revision 4): justify-between restoration verified across all 4 breakpoints and 3 browsers, CTA button correctly positioned at bottom of content panel on desktop, responsive behavior consistent on mobile/tablet, all 12 final screenshots captured, 0 issues |
| 2026-02-23 PST | Updated block.json example: viewportWidth 1400→1440 to match standard section preview width. |
| 2026-03-09 PST | BH #80 #77 #74 #64 #62 #61 #47 #44 #35 #33 #32 #29 #27 #22 #17 #16 #15 #13 #12 #10: ThemeHeading spacing fixes. Heading-to-description spacing increased to 48px (`not-group-last:mb-12`), description-to-buttons spacing set to 32px (`not-last:mb-8`). Added `theme-heading` class to wrapper for tertiary button padding scoping. Tertiary buttons inside ThemeHeading now have `padding-top/bottom: calc(1rem + 1px)` to match primary/secondary touch area. |
| 2026-03-09 PST | Button row gap changed from `gap-4` to `gap-x-4 gap-y-2` (8px row-gap) on ThemeHeading buttons wrapper and ButtonRow block (PHP + TSX). |
