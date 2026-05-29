# Block Report: Cards Carousel

**Date:** 2026-01-30 16:40 PST
**Test Page:** https://ign.localhost/test-cards-carousel-2/
**Figma Source:**
- [Desktop](https://www.figma.com/design/bpRK9A1l2nTbWfMg1pX5yK/IGN-%7C-WEBSITE--INTERNAL-?node-id=811-59110&m=dev)

## Requirements

### User Requirements

- [x] Carousel with parent/child block pattern
- [x] Each card as an inner block with accent color background
- [x] Dark mode support (based on ContentWithMedia patterns)
- [x] Tertiary button with arrow icon (using `after` parameter on ThemeButton)
- [x] Arrow hover state: circular with colored background (CSS circle, not SVG)
- [x] Configurable columns: 1, 2, or 3
- [x] Mobile: 1 column, Tablet: up to 2 columns
- [x] WAI-ARIA carousel pattern (carousel role, slide roles, position labels)
- [x] Autoplay toggle with Pause/Play icons
- [x] aria-live region management
- [x] prefers-reduced-motion support
- [x] Focus pause behavior

### Block Type Requirements

No block type requirements documented.

## Block Behavior

### Layout
- Two-column header: eyebrow+heading on left, description on right (using ThemeHeading with columns=2)
- Navigation arrows positioned inline with progress bar on desktop, below carousel on mobile
- Progress bar pagination above carousel slides
- Configurable column count: 1, 2, or 3 visible cards on desktop

### Content
- Optional eyebrow text above heading (hidden when empty)
- Main heading for section title
- Description paragraph
- Each card contains: title, description, and tertiary button with arrow

### Cards
- Accent color background (adapts to theme color scheme)
- Rounded corners (2xl)
- Title, description, and button with arrow icon
- Button arrow shows circular charcoal background on hover

### Conditional Behaviors
- Navigation arrows hidden when disabled via block settings
- Progress bar pagination hidden when disabled
- Carousel can loop infinitely or stop at ends
- Autoplay available with configurable delay and pause/play toggle control
- Dark mode adds charcoal section background
- Autoplay pauses when carousel receives focus (focus pause behavior)
- Animations respect prefers-reduced-motion preference

### Responsive Behavior
- Mobile (375px): 1 column, navigation below carousel
- Tablet (768px): Up to 2 columns
- Desktop (1024px+): Up to 3 columns (configurable)

## Development Notes

### Design Decisions

- Parent/child block pattern chosen to allow flexible card content editing
- `providesContext`/`usesContext` used to pass column setting from parent to children for proper slide width calculation
- Swiper.js with `breakpointsBase: "container"` for container-relative responsive behavior
- ThemeHeading with `columns={2}` for two-column header layout (eyebrow+heading left, description right)
- Navigation arrows placed inline with progress bar (same row) to match Figma design
- Dark mode uses ContentWithMedia pattern: `dark bg-transparent!` on section with `before:` pseudo-element charcoal background around content
- Padding structure refactored to match DynamicContentCarousel/TestimonialsCarousel pattern: section padding removed (py-10 sm:py-16 → removed), all padding moved to container (py-18 md:py-23), pseudo-element inset adjusted (before:-inset-y-8 → before:inset-y-0)
- Full WAI-ARIA carousel pattern implemented: carousel roledescription, slide roles with position/size labels, aria-hidden on non-interactive pagination, autoplay toggle button, aria-live region for dynamic updates, prefers-reduced-motion support, focus pause behavior

### Color Mapping

- `#1F1F1D (dark bg) → bg-charcoal` - Direct match
- `#D4FF45 (neon green cards) → bg-accent` - Uses theme accent color variable

### Trade-offs

- Inlined arrow SVG in PHP instead of using `theme_block_asset()` because path resolution fails from child block context

### Deviations from Design

- Button arrow hover circle implemented via CSS (`rounded-full bg-charcoal`) rather than separate SVG with circle element - matches the spec requirement

## Issues to Address

None currently identified.

## Test Results

### Validation Summary

| Property | Value |
|----------|-------|
| **Last Test Type** | Full |
| **Overall Match** | Excellent |
| **Breakpoints Tested** | 375px, 768px, 1024px, 1440px |
| **Browsers Tested** | Chromium, Firefox, WebKit |
| **Variations Tested** | 14 comprehensive test cases (DemoContainer-wrapped) |

### Screenshots

#### Full Validation (All Browsers)

| Breakpoint | Chromium | Firefox | WebKit |
|------------|----------|---------|--------|
| 375px | [view](screenshots/cards-carousel-chromium-375w.png) | [view](screenshots/cards-carousel-firefox-375w.png) | [view](screenshots/cards-carousel-webkit-375w.png) |
| 768px | [view](screenshots/cards-carousel-chromium-768w.png) | [view](screenshots/cards-carousel-firefox-768w.png) | [view](screenshots/cards-carousel-webkit-768w.png) |
| 1024px | [view](screenshots/cards-carousel-chromium-1024w.png) | [view](screenshots/cards-carousel-firefox-1024w.png) | [view](screenshots/cards-carousel-webkit-1024w.png) |
| 1440px | [view](screenshots/cards-carousel-chromium-1440w.png) | [view](screenshots/cards-carousel-firefox-1440w.png) | [view](screenshots/cards-carousel-webkit-1440w.png) |

### Test Cases

| # | Test Case | Status | Notes |
|---|-----------|--------|-------|
| 1 | Items = Columns (3 items, 3 cols) | Pass | No scrolling needed |
| 2 | Items = Columns (2 items, 2 cols) | Pass | No scrolling needed |
| 3 | Items > Columns (6 items, 3 cols) | Pass | Scrolling functional |
| 4 | Autoplay enabled | Pass | Auto-advances (2s delay), pause/play toggle |
| 5 | Loop enabled | Pass | Infinite loop working |
| 6 | Loop + Autoplay combined | Pass | Both features together |
| 7 | No navigation arrows | Pass | Pagination only |
| 8 | No pagination | Pass | Arrows only |
| 9 | Long content | Pass | Variable heights handled |
| 10 | Cards without buttons | Pass | Layout consistent |
| 11 | Single column mode | Pass | 1 card at a time |
| 12 | Loop Mode (no autoplay) | Pass | DemoContainer-wrapped variation |
| 13 | Loop + Autoplay | Pass | DemoContainer-wrapped variation, 6/6 QA checks passed |
| 14 | Accessibility features | Pass | WAI-ARIA carousel pattern, focus pause, prefers-reduced-motion |

### What Matched

**Layout**
- [x] Dark mode section with charcoal background
- [x] Light mode section with white background
- [x] Multi-slide view (1, 2, or 3 columns)
- [x] Two-column header (eyebrow+heading left, description right)
- [x] Progress bar with navigation arrows inline

**Typography**
- [x] Heading hierarchy (h2 section, h3 cards)
- [x] Eyebrow styling

**Colors**
- [x] Accent color card backgrounds
- [x] Charcoal text on cards
- [x] White text on dark section

**Components**
- [x] Navigation arrows with circular outline
- [x] Tertiary button with arrow icon
- [x] Arrow hover state with circular background

**Features**
- [x] Autoplay functionality with pause/play toggle
- [x] Loop/infinite scroll
- [x] Configurable columns
- [x] Optional navigation/pagination
- [x] Full WAI-ARIA carousel pattern compliance
- [x] Focus pause behavior
- [x] prefers-reduced-motion support
- [x] aria-live region management

## Changelog

| Timestamp | Change |
|-----------|--------|
| 2026-01-30 14:00 PST | Initial block implementation |
| 2026-01-30 14:30 PST | Fixed card background color (bg-accent -> bg-neon-green) |
| 2026-01-30 14:45 PST | Fixed arrow icon not rendering in PHP (inline SVG) |
| 2026-01-30 16:17 PST | Added test page with 6-card example |
| 2026-01-30 16:27 PST | Created comprehensive test page with 11 test cases |
| 2026-01-30 16:36 PST | Fixed header layout to use ThemeHeading with columns=2; moved navigation arrows inline with progress bar |
| 2026-01-30 16:40 PST | Changed card background from bg-neon-green to bg-accent (dark mode no longer overrides accent color) |
| 2026-01-30 16:55 PST | Fixed dark mode to use ContentWithMedia pattern (bg-transparent! with before: pseudo-element charcoal card) |
| 2026-01-30 17:05 PST | Full validation: captured screenshots in all browsers (Chromium, Firefox, WebKit) |
| 2026-02-12 14:02 PST | Edit: Three-part update: (1) Padding structure refactored - removed section padding (py-10 sm:py-16), moved all padding to container (py-18 md:py-23), changed pseudo from before:-inset-y-8 to before:inset-y-0. (2) Accessibility improvements - added full WAI-ARIA carousel pattern with 10 new attributes: carousel roledescription, slide roles with position labels, aria-hidden on pagination, autoplay toggle button with pause/play control, aria-live region management, prefers-reduced-motion support, focus pause behavior. (3) Test page rebuilt with 14 DemoContainer-wrapped variations including new Loop Mode and Loop + Autoplay variations. Build: PASS. QA: PASS (6/6). Visual appearance identical, code architecture cleaner. |
| 2026-02-12 14:21 PST | Edit: Color lock applied - progress bar and navigation buttons now always use neon-green-to-blue gradient regardless of page accent color. Added CSS custom property override scoped to block wrapper. Build: PASS. |
| 2026-02-18 PST | Tertiary button arrow style update: Arrow now animates 12px right on hover/focus via margin transition (pre-reserved with `margin-right: 0.75rem`, transitions to `margin-left: 0.75rem; margin-right: 0`). Hover underline removed. Arrow wrapper class changed from inline Tailwind utilities to `btn-tertiary-arrow` CSS class. Animation handled globally in `resources/css/screen/button.css`. |
| 2026-02-23 PST | Updated block.json example: viewportWidth 1400→1440 to match standard section preview width. |
| 2026-03-06 PST | Progress bar empty background now uses `color-mix(in srgb, currentColor 50%, transparent)` for 50% opacity currentColor. Applied globally in `resources/css/screen/swiper.css`. |
| 2026-03-09 PST | BH #51 #46 #41 #19 #61: Carousel controls row now uses `justify-end` so pause button and navigation arrows right-align when pagination is disabled. Added to all 4 carousel blocks (PHP + TSX where applicable). |
| 2026-03-09 PST | BH #58 #48 #14 #3: Enabled buttons on this block (was `enableButtons: false`). Added `buttons` attribute to block.json (no default, uses ThemeHeading 3-button default). Passed `buttons` to ThemeHeading in both TSX and PHP. All button variations (primary, secondary, tertiary) now available. |
| 2026-03-09 PST | BH #80 #77 #74 #64 #62 #61 #47 #44 #35 #33 #32 #29 #27 #22 #17 #16 #15 #13 #12 #10: ThemeHeading spacing fixes. Heading-to-description spacing increased to 48px (`not-group-last:mb-12`), description-to-buttons spacing set to 32px (`not-last:mb-8`). Added `theme-heading` class to wrapper for tertiary button padding scoping. Tertiary buttons inside ThemeHeading now have `padding-top/bottom: calc(1rem + 1px)` to match primary/secondary touch area. |
| 2026-03-09 PST | Button row gap changed from `gap-4` to `gap-x-4 gap-y-2` (8px row-gap) on ThemeHeading buttons wrapper and ButtonRow block (PHP + TSX). |
