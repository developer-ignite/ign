# Block Report: Gallery Carousel

**Date:** 2026-02-12 21:04 PST
**Test Page:** https://ign.localhost/test-gallery-carousel/
**Figma Source:** Not provided in original report

## Requirements

### User Requirements

- [x] Parent/child block pattern (takt/gallery-carousel and takt/gallery-carousel-item)
- [x] Image focal point selection support
- [x] Dark mode with charcoal background
- [x] Progress bar pagination with neon-green gradient
- [x] Circular navigation buttons
- [x] Responsive aspect ratios (aspect-[1.08] mobile, aspect-[2.45] sm+)
- [x] Always single slide visible (slidesPerView: 1)
- [x] Optional autoplay with pause/play toggle
- [x] Optional loop mode
- [x] WAI-ARIA carousel pattern compliance
- [x] Noise texture overlay (CSS-based feTurbulence filter)

### Block Type Requirements

No block type requirements documented.

## Block Behavior

### Layout
- Dark mode section with charcoal rounded background
- ThemeHeading with two-column layout option (eyebrow+heading left, description+buttons right)
- Controls row (progress bar + navigation arrows) positioned between header and carousel on all breakpoints
- Single image visible at a time across all breakpoints
- Noise texture overlay for visual interest

### Content
- Optional eyebrow text above heading (hidden when empty)
- Main heading for section title
- Optional description text
- Optional CTA buttons via ThemeHeading (uses default button variations: primary, secondary, tertiary)
- Each carousel item contains a single image with focal point selection

### Carousel Controls
- Progress bar shows scroll position with neon-green gradient fill
- Circular previous/next navigation buttons
- Both controls can be individually toggled off
- Optional infinite loop
- Optional autoplay with configurable delay and pause/play toggle

### Conditional Behaviors
- Eyebrow, heading, description, and buttons hidden when left empty
- Block name in editor list view matches heading text
- Aria-labelledby when heading present, falls back to aria-label="Gallery Carousel" when heading empty
- Autoplay pauses on keyboard focus

### Responsive Behavior
- Mobile (375px): aspect-[1.08] images
- Tablet/Desktop (768px+): aspect-[2.45] images
- Controls positioning consistent across all breakpoints

### Accessibility

#### WAI-ARIA Carousel Pattern (14/14 requirements)
- **Carousel container**: role="region" with aria-roledescription="carousel"
- **Accessible name**: Via aria-labelledby pointing to heading when present; conditional fallback to aria-label="Gallery Carousel" when heading empty
- **Slides**: role="group" with aria-roledescription="slide" and aria-label="Slide X of Y" (added via JavaScript)
- **Rotation control**: Native button element as first tab-stop with dynamic aria-label (Stop/Start slide rotation)
- **Data attributes**: data-label-pause and data-label-play sync aria-label updates with icon state (both PHP and TSX)
- **Aria-live**: Toggles between 'off' (autoplay active) and 'polite' (paused)
- **Motion respect**: prefers-reduced-motion disables autoplay
- **Focus management**: Autoplay pauses on keyboard focus, resumes on blur
- **Focus visible**: Navigation buttons have :focus-visible styles
- **Inert management**: Inactive slides receive inert attribute when not in loop mode

## Development Notes

### Design Decisions

1. **Controls position**: Between header and carousel on ALL breakpoints (spec override of Figma desktop positioning)
2. **Button variation**: Uses ThemeHeading default variations (primary, secondary, tertiary) - reverted from initial restricted set
3. **Noise texture**: CSS SVG feTurbulence filter (no PNG asset needed) - preserved during pseudo-element refactor
4. **Image aspect ratio**: Responsive - `aspect-[1.08]` mobile, `aspect-[2.45]` sm+
5. **Swiper config**: Always `slidesPerView: 1`, no breakpoints needed
6. **Dark mode**: Pseudo-element background pattern matching other carousels (standardized in Edit 2)

### Padding Standardization

The Gallery Carousel was refactored to use consistent padding across all carousel blocks:

- **Previous approach**: Compound padding (outer container `py-18 md:py-23` + inner `bg-charcoal` div with `py-9 sm:py-24`) created inconsistent spacing: `py-27` mobile, `md:py-47` desktop
- **Current approach**: Single padding layer (`py-18 md:py-23`) on container with pseudo-element dark background (matching CardsCarousel, TestimonialsCarousel, DynamicContentCarousel)
- **Rationale**: Standardization across all carousel blocks reduces maintainability issues and ensures consistent visual spacing throughout the design system

### Inert Attribute Management

Added JavaScript-based inert attribute management for inactive slides:

- **Implementation**: When `loopCarousel` is disabled, off-screen slides receive the `inert` attribute to prevent keyboard users from tabbing into invisible content
- **Pattern**: Matches the inert management in TestimonialsCarousel.js (lines 108-129)
- **Scope**: Only applies when loop mode is off; loop mode allows continuous cycling without inert management
- **Accessibility benefit**: Ensures keyboard navigation focuses only on visible, interactive content

### Color Consistency

Gradient colors for buttons and progress bar are locked to neon-green/blue via CSS custom properties:

- `--gradient-left: var(--color-neon-green)`
- `--gradient-right: var(--color-blue)`
- These variables control both the progress bar fill and navigation button hover gradient via shared swiper.css rules
- This ensures consistent color rendering across all carousel blocks regardless of page accent color

### Noise Texture Preservation

The unique noise texture overlay (CSS-based feTurbulence filter) was preserved during the pseudo-element refactor:

- Positioned absolutely inside the container to overlay the pseudo-element background
- Remains `aria-hidden="true"` (purely decorative)
- Maintains the same visual appearance as before the refactor

### Aria-Labelledby Conditional Fallback Pattern

The carousel container implements conditional accessible naming for improved flexibility:

- **When heading is present**: Uses `aria-labelledby` pointing to the heading element ID (e.g., `auto-{hash}-heading`), providing users with the actual section title
- **When heading is empty**: Falls back to `aria-label="Gallery Carousel"` on the section element, ensuring the carousel always has an accessible name
- **Implementation**: Both TSX and PHP check for empty heading condition and apply the appropriate ARIA attribute
- **Rationale**: Allows users to create gallery carousels with or without visible headings while maintaining full accessibility compliance
- **Test coverage**: New "No Heading (aria-label fallback)" variation confirms both paths work correctly

### Accessibility: WAI-ARIA Carousel Pattern

Full compliance with WAI-ARIA carousel pattern (14/14 requirements):

- **Carousel container**: `role="region"` with `aria-roledescription="carousel"`
- **Accessible name**: Via `aria-labelledby` pointing to heading when heading is present; conditional fallback to `aria-label="Gallery Carousel"` when heading is empty
- **Slides**: `role="group"` with `aria-roledescription="slide"` and `aria-label="Slide X of Y"` (added via JavaScript)
- **Rotation control**: Native `<button>` element; first tab-stop in carousel with dynamic `aria-label` (Stop/Start slide rotation)
- **Data attributes**: `data-label-pause` and `data-label-play` sync aria-label updates with icon state (both PHP and TSX)
- **Aria-live**: Toggles between `off` (autoplay active) and `polite` (paused)
- **Motion respect**: `prefers-reduced-motion` disables autoplay
- **Focus management**: Autoplay pauses on keyboard focus, resumes on blur
- **Focus visible**: Navigation buttons have `:focus-visible` styles
- **Inert management**: Inactive slides receive `inert` attribute when not in loop mode

### TestimonialsCarousel Color Consistency

As part of the broader carousel standardization effort, TestimonialsCarousel.css was updated to use CSS variable references instead of raw rgba values:

- Changed from: `--gradient-left: rgba(212, 255, 69, 1); --gradient-right: rgba(71, 203, 242, 1);`
- Changed to: `--gradient-left: var(--color-neon-green); --gradient-right: var(--color-blue);`
- Rationale: Improves maintainability by centralizing color definitions and matches the pattern used in CardsCarousel, DynamicContentCarousel, and GalleryCarousel

## Issues to Address

No unresolved issues. All identified issues during development were resolved during the fix cycle.

## Test Results

### Validation Summary

| Property | Value |
|----------|-------|
| **Overall Status** | PASS |
| **Last Test Type** | Full |
| **Build Status** | Successful |
| **Functional QA** | PASS after fix cycle - all checks passing |
| **Breakpoints Tested** | 375px, 768px, 1024px, 1440px |
| **Browsers Tested** | Chromium, Firefox, WebKit |
| **Accessibility** | WAI-ARIA carousel pattern fully compliant (14/14 requirements pass) |
| **TSX/PHP Sync** | Verified and synchronized |

### Screenshots

#### Full Page Screenshots (All Breakpoints)

| Breakpoint | Chromium | Firefox | WebKit |
|------------|----------|---------|--------|
| 375px | [view](screenshots/gallery-carousel-final-chromium-375w.png) | [view](screenshots/gallery-carousel-final-firefox-375w.png) | [view](screenshots/gallery-carousel-final-webkit-375w.png) |
| 768px | [view](screenshots/gallery-carousel-final-chromium-768w.png) | [view](screenshots/gallery-carousel-final-firefox-768w.png) | [view](screenshots/gallery-carousel-final-webkit-768w.png) |
| 1024px | [view](screenshots/gallery-carousel-final-chromium-1024w.png) | [view](screenshots/gallery-carousel-final-firefox-1024w.png) | [view](screenshots/gallery-carousel-final-webkit-1024w.png) |
| 1440px | [view](screenshots/gallery-carousel-final-chromium-1440w.png) | [view](screenshots/gallery-carousel-final-firefox-1440w.png) | [view](screenshots/gallery-carousel-final-webkit-1440w.png) |

#### Functional QA Verification Screenshots

| Test | Screenshot |
|------|-----------|
| Padding verification (mobile) | [view](screenshots/gallery-carousel-padding-verification-375w.png) |
| Padding verification (tablet) | [view](screenshots/gallery-carousel-padding-verification-768w.png) |
| Padding verification (desktop) | [view](screenshots/gallery-carousel-padding-verification-1440w.png) |
| Navigation test | [view](screenshots/gallery-carousel-nav-test-1440w.png) |
| Autoplay toggle | [view](screenshots/gallery-carousel-autoplay-toggle-1440w.png) |
| Inert attribute check | [view](screenshots/gallery-carousel-inert-check-1440w.png) |

### Test Cases

13 variations on test page (all wrapped in DemoContainer blocks):

| Test Case | Status | Notes |
|-----------|--------|-------|
| Full Content | Pass | All optional fields populated |
| Minimal | Pass | Heading only, default controls |
| Empty Optional Fields | Pass | Tests shouldDisplay conditional logic |
| No Controls | Pass | Both pagination and navigation hidden |
| Pagination Only | Pass | Navigation arrows hidden |
| Navigation Only | Pass | Progress bar hidden |
| Long Content | Pass | Long heading/description wraps properly |
| Autoplay with Loop | Pass | Auto-advances with pause/play toggle |
| Loop Only | Pass | Infinite scroll without autoplay |
| Autoplay Only | Pass | Auto-advances without loop |
| Single Image | Pass | One image carousel works correctly |
| Many Images (10+) | Pass | Large carousel handles correctly |
| No Heading (aria-label fallback) | Pass | Aria-label fallback when heading empty |

### What Matched

**Build & Code Quality**
- [x] Build compiles successfully (no TypeScript errors)
- [x] Block registers with correct apiVersion 3
- [x] All attributes properly defined with correct types and defaults
- [x] TSX and PHP perfectly synchronized
- [x] No manual attribute extraction in PHP
- [x] Inner blocks configuration correct

**Functional Requirements**
- [x] Padding standardized to py-18 md:py-23 (matches other carousels)
- [x] Dark mode uses pseudo-element pattern (matches CardsCarousel, TestimonialsCarousel, DynamicContentCarousel)
- [x] Noise texture overlay preserved and positioned correctly
- [x] Inert attribute management implemented for inactive slides (when loop disabled)
- [x] Color gradient locked to neon-green/blue via CSS variables
- [x] Slide ARIA attributes added via JavaScript
- [x] Carousel navigation advances slides correctly
- [x] Autoplay toggle switches states with correct aria-label
- [x] Respects prefers-reduced-motion setting

**Accessibility (WAI-ARIA Carousel Pattern)**
- [x] Carousel container has role="region"
- [x] Carousel container has aria-roledescription="carousel"
- [x] Carousel has accessible name via aria-labelledby
- [x] All slides have role="group"
- [x] All slides have aria-roledescription="slide"
- [x] All slides have accessible name "Slide X of Y"
- [x] Navigation buttons have accessible names
- [x] Rotation control is first tab-stop
- [x] Focus management works (pause on focus, resume on blur)
- [x] Focus-visible styles applied to interactive elements
- [x] Keyboard navigation works (prev/next buttons, autoplay toggle)

**Responsive Design**
- [x] Mobile layout correct (375px)
- [x] Tablet layout correct (768px)
- [x] Small desktop correct (1024px)
- [x] Desktop layout correct (1440px)
- [x] Controls responsive positioning and spacing

## Changelog

| Date | Changes |
|------|---------|
| 2026-02-06 | Initial build: all block files, test page (9 variations), QA passed |
| 2026-02-06 | Moved border-radius from individual slides to swiper container for consistent rounding during transitions |
| 2026-02-06 | Reverted buttonVariations to ThemeHeading defaults (all variations available) |
| 2026-02-06 | Child block: show plain `<img>` when image set instead of ImageDropUploader (prevents picker reopening on click) |
| 2026-02-06 | Removed unnecessary appender padding hack (`pb-12 -mb-12`) -- Appender already renders outside overflow-hidden boundary |
| 2026-02-12 14:52 PST | Edit: Comprehensive update to match other carousel blocks. (1) Padding refactor: removed section padding (py-6 sm:py-16), moved to container (py-18 md:py-23), standardized with other carousels. (2) Design QA fixes: button variant to secondary, navigation gap to gap-2 md:gap-4, controls gap to gap-4. (3) Full WAI-ARIA carousel pattern: added role="region", aria-labelledby, slide ARIA attributes, autoplay toggle with Pause/Play icons, aria-live management, prefers-reduced-motion support, focus pause behavior. (4) Color lock: neon-green gradient always displayed via GalleryCarousel.css. (5) Test page: expanded to 11 variations with Loop Only and Autoplay Only. Build: PASS. QA: PASS. Files: PHP, TSX, JS (rewritten), CSS (new). |
| 2026-02-12 15:33 PST | Padding standardization refactor: replaced compound padding (outer + inner) with single py-18 md:py-23 container layer; refactored dark mode to pseudo-element pattern matching other carousels (CardsCarousel, TestimonialsCarousel, DynamicContentCarousel). Added inert attribute management in JavaScript for inactive slides (improves keyboard accessibility). Updated TestimonialsCarousel.css to use CSS variable references for consistency. Preserved unique noise texture overlay in new structure. Build: PASS. Functional QA: PASS (9/10 checks, 1 infrastructure false positive). |
| 2026-02-12 21:04 PST | Accessibility audit and compliance verification cycle. Accessibility audit PASS (14/14 WAI-ARIA carousel requirements). TSX/PHP sync fixes: added data-label-pause and data-label-play attributes to TSX autoplay toggle button, matching PHP implementation. Fixed aria-labelledby conditional fallback pattern to use aria-labelledby when heading present, aria-label when heading empty (improves flexibility for headless galleries). Fixed doubled -heading suffix in aria-labelledby PHP reference. Test page rebuilt with 13 DemoContainer-wrapped variations (up from 11): added "Empty Optional Fields" and "No Heading (aria-label fallback)" test cases. Demo media images updated with proper alt text. Build: PASS. Functional QA: PASS after fix verification. Note: Files Created section from original report removed and integrated into changelog entries. |
| 2026-02-18 PST | Replaced `rounded-2xl` border-radius with `default-mask` CSS class on the swiper carousel container. The `default-mask` class uses a CSS mask for the rounded shape. Applied to both TSX and PHP. |
| 2026-02-23 PST | Updated block.json example: viewportWidth 1400→1440, added unique picsum image URLs (1040, 957, 666) to GalleryCarouselItem inner blocks. Also updated standalone GalleryCarouselItem example with image URL (1040). |
| 2026-03-06 PST | Progress bar empty background now uses `color-mix(in srgb, currentColor 50%, transparent)` for 50% opacity currentColor. Applied globally in `resources/css/screen/swiper.css`. |
| 2026-03-09 PST | BH #51 #46 #41 #19 #61: Carousel controls row now uses `justify-end` so pause button and navigation arrows right-align when pagination is disabled. Added to all 4 carousel blocks (PHP + TSX where applicable). |
| 2026-03-09 PST | BH #58 #48 #14 #3: Removed `buttonVariations: ['secondary']` override from ThemeHeading (TSX + PHP). All button variations (primary, secondary, tertiary) now available. |
| 2026-03-09 PST | BH #80 #77 #74 #64 #62 #61 #47 #44 #35 #33 #32 #29 #27 #22 #17 #16 #15 #13 #12 #10: ThemeHeading spacing fixes. Heading-to-description spacing increased to 48px (`not-group-last:mb-12`), description-to-buttons spacing set to 32px (`not-last:mb-8`). Added `theme-heading` class to wrapper for tertiary button padding scoping. Tertiary buttons inside ThemeHeading now have `padding-top/bottom: calc(1rem + 1px)` to match primary/secondary touch area. |
| 2026-03-09 PST | Button row gap changed from `gap-4` to `gap-x-4 gap-y-2` (8px row-gap) on ThemeHeading buttons wrapper and ButtonRow block (PHP + TSX). |
