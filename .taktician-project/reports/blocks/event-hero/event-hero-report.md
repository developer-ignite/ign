# EventHero Block Report

**Date:** 2026-02-25 15:10 PST
**Test Page:** https://ign.localhost/test-event-hero/
**Status:** Complete

---

## Header

### Block Overview

The **Event Hero** block is a full-width hero section designed for single event pages (The Events Calendar). It displays event-specific information including title, date/time range, venue location, excerpt, pricing, and an optional external link button. The block layout mirrors the PostHero block structure with a gradient background and masked featured image.

### Test Page
https://ign.localhost/test-event-hero/ (Page ID: 248)

**Figma Source:**
This block has no Figma design. It was built from a spec inspired by the PostHero block, adapted for The Events Calendar plugin events.

---

## Requirements

### User Requirements

- [x] Display event title as the main heading
- [x] Show event start and end date/time with smart formatting (collapse dates for same-day events)
- [x] Display venue name when available
- [x] Show event excerpt by default (toggle control available)
- [x] Display event cost/price when available
- [x] Display optional external link button (when _EventURL is populated)
- [x] Apply category color gradient and accent colors
- [x] Support all-day events (without time display)
- [x] Support multi-day events (with full start/end date+time)
- [x] Gradient height caps to main element boundary (prevent overflow)
- [x] Minimum height set to min(700px, 100vh) with content aligned to bottom

### Block Type Requirements

- [x] Block renders dynamically via PHP (no static save function)
- [x] Block reads from The Events Calendar post meta fields
- [x] Category pills display event categories from tribe_events_cat taxonomy
- [x] External link button uses btn-primary styling
- [x] Responsive layout adapts to mobile, tablet, and desktop viewports
- [x] Accessibility: Date/time wrapped in `<time>` elements with ISO 8601 datetime attributes
- [x] Accessibility: External link button includes sr-only text describing destination
- [x] Accessibility: Featured image marked as presentation (decorative)

---

## Block Behavior

The Event Hero block serves as a hero header for individual event pages, automatically pulling event data from The Events Calendar plugin.

### Content Display

When placed on an event page, the block displays the event title in large heading text (text-header-0). If the event has a featured image, it appears as a masked background behind the content with a gradient overlay. The gradient uses 150vh height by default but is automatically capped to the height of the main content area (the `<main>` element) via JavaScript, preventing it from extending beyond the page layout boundaries. This ensures the gradient scales responsively while respecting layout constraints on different screen sizes and content lengths. The gradient color is derived from the page's accent color.

The hero section maintains a minimum height of min(700px, 100vh), ensuring the hero never appears too cramped on small viewports (it won't exceed 100% of the viewport height) while providing adequate space on larger screens. Content is positioned at the bottom of the hero area using a CSS flexbox layout—the hero container uses `display: flex`, `flex-direction: column`, and `justify-content: flex-end` to push all content to the bottom, while the background image and gradient continue to fill the entire minimum height above it.

### Event Details

The block automatically displays the event's start date and time using the Anton heading font for visual prominence. If the event has an end date on the same day, both times are shown in a single line (e.g., "February 20, 2026 | 6:00 PM - 9:00 PM"). For multi-day events, the full date range is displayed (e.g., "February 20, 2026, 6:00 PM - February 22, 2026, 9:00 PM"). All-day events omit the time portion, showing only the date. When an event is all-day and spans multiple days, only the date range is shown (e.g., "February 20 - 22, 2026").

### Optional Content

The event excerpt appears below the title by default; the "Show Excerpt" toggle allows editors to hide it if needed. The venue name is displayed automatically when the event has a location assigned. If the event has a cost, it appears in the metadata section with the currency symbol and amount (e.g., "$25.00"). An external link button labeled "Visit Event Website" (styled as btn-primary) appears at the bottom only if the event has an external URL configured; otherwise, the button is hidden.

### Category Pills

Event category pills appear above the title, showing the event's assigned categories from the Events Calendar taxonomy. Each pill uses the theme's accent color system for styling and is left-aligned with a wrapped layout if multiple categories are present.

### Responsive Behavior

On mobile devices (under 640px), the block maintains the same layout as desktop but with reduced padding (8px bottom vs 16px). Larger screens use the full 16px+ padding. The content area is constrained to a maximum width of 700px and left-aligned, allowing the background image and gradient to extend full-width. The gradient height cap adjusts dynamically as the window resizes, recomputing based on the current `<main>` element height.

---

## Development Notes

Used PostHero block as the layout and styling foundation. The date formatting logic handles all four event combinations (same-day timed, multi-day timed, all-day single, all-day range) with conditional collapsing of dates when start and end fall on the same calendar day. The `wp_date()` function is used instead of PHP's native `date()` for timezone-aware formatting consistent with WordPress site settings. Date/time output is wrapped in semantic `<time>` elements with ISO 8601 datetime attributes (using interval notation for ranges, e.g., `2026-02-20T18:00/2026-02-22T21:00`) for accessibility and machine readability.

The gradient height behavior is implemented via a dedicated EventHero.js file using a ResizeObserver pattern. This scoped JavaScript targets only EventHero instances (`.event-hero .top-gradient` selector), preventing interference with other hero variants (Hero, PostHero). The ResizeObserver listens to the nearest `<main>` element and sets an inline max-height style on the gradient, capping its expansion. This pattern reuses the established Hero.js approach but isolates it to the EventHero block, allowing each hero variant to manage its own gradient constraints independently.

EventHero is now fully independent from the Hero block. A dedicated EventHero.css file contains the `.event-hero .top-gradient` gradient styles (copied from Hero.css but scoped to avoid conflicts). The 'hero' class was removed from the wrapper element in both PHP (theme_block_props) and TSX (useBlockProps), and internal class names were renamed from 'hero-inner' to 'event-hero-inner' for namespace clarity. This ensures EventHero works completely independently; if the Hero block were removed, EventHero would continue functioning without any CSS dependencies.

The useTopicColor attribute was removed after initial implementation; the gradient now always derives from the page accent color for consistency. The date/time line uses the Anton heading font (font-heading) instead of regular medium weight text to give the event timing visual prominence and distinguish it from other metadata. The external link button uses the self-start class to prevent it from stretching to full width when contained within a flex-column parent, maintaining content-width sizing.

For the bottom-alignment layout revision, the hero container uses flexbox with `justify-content: flex-end` to position all content at the bottom of the min-height area. The content layer's top padding was simplified from `pt-[calc(var(--header-height)+180px)] sm:pt-[calc(var(--header-height)+280px)]` to `pt-[var(--header-height)]`—this provides only the minimum clearance needed for the fixed header, since flex justify-end now handles the vertical positioning. Bottom padding (`pb-8 sm:pb-16`) is retained for breathing room at the bottom of the hero.

---

## Issues to Address

No issues. Functional QA passed with 11/11 checks and 0 issues in the latest cycle.

---

## Test Results

### Validation Summary

| Check | Status | Notes |
|-------|--------|-------|
| Build | PASS | All errors resolved; pre-existing asset size warnings unrelated to block |
| Block Registration | PASS | block.json valid, all required fields present (apiVersion 3, takt/event-hero, attributes) |
| TSX/PHP Sync | PASS | Known false-positive on root wrapper (InspectorControls vs section) — expected pattern for blocks with editor controls |
| CSS Isolation | PASS | EventHero.css exists with scoped .event-hero .top-gradient rule; no dependency on Hero.css |
| CSS Bundling | PASS | EventHero.css bundled into public/css/screen.css via webpack glob |
| Hero Class Removal | PASS | 'hero' class NOT present on any EventHero wrapper; verified via page_audit on all 5 instances |
| Gradient Rendering | PASS | Gradient renders correctly at all breakpoints and in all browsers (chromium, firefox, webkit); fully independent |
| JS Bundling | PASS | EventHero.js bundled into public/js/screen.js via webpack glob |
| ResizeObserver Scoping | PASS | Selector correctly scoped to '.event-hero .top-gradient'; no interference with other hero variants |
| No JS Errors | PASS | No JavaScript console errors during page load |
| Block Rendering | PASS | All 5 block instances render correctly with full content across all test variations |
| Responsive Layout | PASS | Screenshots at 375/768/1024/1440px confirm clean layout at all breakpoints; no breakage or overflow |
| Min Height & Bottom Alignment | PASS | min-height: min(700px, 100vh) correctly applied on .event-hero-inner in EventHero.css; content positioned at bottom via flex justify-end; verified via computed styles and visual inspection at all breakpoints |
| Accessibility | PASS | Heading hierarchy valid (h1 used correctly); images use alt='' (role=presentation); all common checks passed |
| Spec Compliance | PASS | Test page covers all specified variations; block meets requirements |
| Automated Rules | PASS | All 13 automated rule checks passed (RENDER_200, BLOCK_WRAPPER, NOT_EMPTY, NO_JS_ERRORS, NO_OVERFLOW, IMAGES_ALT, LINKS_HREF, HEADING_HIERARCHY, REDUCED_MOTION, NO_EMPTY_SRC, LAZY_LOAD, SRCSET, DIMENSIONS) |

### Screenshots

**Mobile (375px)**
![Mobile Chromium](screenshots/2026-02-20-142114/event-hero-chromium-375w.png)
![Mobile Firefox](screenshots/2026-02-20-142114/event-hero-firefox-375w.png)
![Mobile WebKit](screenshots/2026-02-20-142114/event-hero-webkit-375w.png)

**Tablet (768px)**
![Tablet Chromium](screenshots/2026-02-20-142114/event-hero-chromium-768w.png)
![Tablet Firefox](screenshots/2026-02-20-142114/event-hero-firefox-768w.png)
![Tablet WebKit](screenshots/2026-02-20-142114/event-hero-webkit-768w.png)

**Laptop (1024px)**
![Laptop Chromium](screenshots/2026-02-20-142114/event-hero-chromium-1024w.png)
![Laptop Firefox](screenshots/2026-02-20-142114/event-hero-firefox-1024w.png)
![Laptop WebKit](screenshots/2026-02-20-142114/event-hero-webkit-1024w.png)

**Desktop (1440px)**
![Desktop Chromium](screenshots/2026-02-20-142114/event-hero-chromium-1440w.png)
![Desktop Firefox](screenshots/2026-02-20-142114/event-hero-firefox-1440w.png)
![Desktop WebKit](screenshots/2026-02-20-142114/event-hero-webkit-1440w.png)

### Test Cases

| Variation | Status | Notes |
|-----------|--------|-------|
| Minimal Event | PASS | Title + start date only; no featured image, venue, excerpt, or external URL |
| Full Content | PASS | All fields populated: featured image, multi-day range, venue, excerpt, cost, external URL |
| Same-Day Event | PASS | Date collapse working: start and end on same day shows time range in single line |
| Long Content Edge Case | PASS | Heading scales and wraps correctly; long venue names wrap within container |
| No External URL | PASS | Event renders correctly; external link button hidden as expected |
| Primary Button Style | PASS | External link button renders with btn-primary styling |

### What Matched

- **Layout:** Hero structure with gradient, masked image, left-aligned content at max-w-[700px], content bottom-aligned via flex justify-end
- **Typography:** Event title uses text-header-0 (largest heading size); date/time uses Anton heading font; metadata uses text-lg with medium font weight
- **Colors:** Category pills use theme accent color system; gradient inherits page accent color
- **Components:** Category pills, btn-primary external link button, heading sizing all consistent with theme system
- **Spacing:** Padding, gap, and margin values follow theme scale (gap-6 between pill area and title, gap-1 between metadata lines, mt-12 before button)
- **Responsive Design:** Gradient cap scales dynamically with <main> element height at all breakpoints; min-height adapts from 700px to 100vh based on viewport

### Excluded Checks

None. Design QA was skipped per block guidance (no Figma design available).

---

## Changelog

| Timestamp | Change |
|-----------|--------|
| 2026-02-20 02:01 PST | Planning complete: full spec with PostHero-inspired layout, event-specific fields, smart date collapsing, 6 test variations |
| 2026-02-20 02:09 PST | Developer: all 5 files created, build passing, test page with 6 block instances deployed |
| 2026-02-20 02:11 PST | Functional QA: initial PASS with 2 minor issues (date() vs wp_date(), missing `<time>` elements) and 2 notes |
| 2026-02-20 02:15 PST | Developer: fixed FQA-001 (wp_date for timezone safety) and FQA-002 (added `<time>` semantic elements) in both PHP and TSX; build passing |
| 2026-02-20 02:17 PST | Functional QA: post-fix re-verification confirms both fixes applied correctly, no regressions, final PASS |
| 2026-02-20 02:30 PST | User edit: changed external link button from btn-tertiary to btn-primary; removed useTopicColor attribute and topic color override functionality; QA verified — PASS with no issues |
| 2026-02-20 10:02 PST | User edit: changed showExcerpt attribute default from false to true, making excerpt visible by default on event pages |
| 2026-02-20 10:07 PST | Developer: added cost display from _EventCost and _EventCurrencySymbol meta fields; PHP builds formatted string, TSX renders with currency prefix |
| 2026-02-20 10:09 PST | User edit: added self-start class to external link button in TSX and PHP to fix full-width stretch from flex-col parent, maintaining content-width sizing |
| 2026-02-20 10:14 PST | Developer: changed date/time text font from font-medium to font-heading (Anton) in both TSX and PHP for visual prominence; venue and cost lines retain font-medium |
| 2026-02-20 10:17 PST | Functional QA: verified all 4 cumulative changes (showExcerpt default, cost display, button self-start, date/time font-heading). Build PASS, all checks PASS, screenshots captured at all widths/browsers. |
| 2026-02-20 14:10 PST | User edit: apply gradient height 150vh with ResizeObserver to cap max-height to <main> element. Developer: created EventHero.js with scoped ResizeObserver for .event-hero .top-gradient selector, auto-bundled via webpack glob. Functional QA: PASS - 7/7 checks, 0 issues. All 5 block variations verified across 4 breakpoints in 3 browsers (chromium, firefox, webkit). |
| 2026-02-20 14:31 PST | Made EventHero fully independent from Hero block. Created EventHero.css with own .event-hero .top-gradient styles. Removed 'hero' class from wrapper in PHP and TSX. Renamed hero-inner to event-hero-inner in both PHP and TSX for namespace clarity. Functional QA: PASS - 13/13 checks, 0 issues. |
| 2026-02-23 PST | Updated block.json example: viewportWidth 1400→1440 to match standard section preview width. |
| 2026-02-23 PST | Replaced block icon SVG to match project standard: cutout pattern (solid fill with content holes) representing full-width hero with background image. Shows category tag, title, date/time, venue, and CTA as cutouts. Replaced generic calendar icon. |
| 2026-02-25 14:57 PST | CSS/layout change: min-height set to min(700px, 100vh) on .event-hero-inner, content aligned to bottom via CSS flex justify-end on container. Top padding simplified from pt-[calc(var(--header-height)+180px)] sm:pt-[calc(var(--header-height)+280px)] to pt-[var(--header-height)] in both TSX and PHP. Bottom padding (pb-8 sm:pb-16) retained for breathing room. |
| 2026-02-25 14:59 PST | Developer: Applied min-height CSS rule with flex justify-end and simplified padding in EventHero.css, EventHero.tsx, EventHero.php. Build passes with no new errors. Existing ESLint react-hooks/exhaustive-deps warnings unrelated to this CSS-only change. |
| 2026-02-25 15:02 PST | Functional QA: PASS - 11/11 checks passed. Min-height, bottom alignment, breakpoints, TSX/PHP sync all verified. Min-height: min(700px, 100vh) correctly applied on .event-hero-inner in EventHero.css; content positioned at bottom via flex justify-end; verified via computed styles and visual inspection at all 4 breakpoints (375px, 768px, 1024px, 1440px). TSX and PHP content layer div classes match exactly. 0 issues found. |
