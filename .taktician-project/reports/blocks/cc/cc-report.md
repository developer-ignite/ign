# Block Report: CC (Cards Carousel)

**Date:** 2026-02-01 21:08 PST
**Test Page:** https://ign.localhost/test-cc-2/
**Figma Source:**
- [Desktop](https://www.figma.com/design/bpRK9A1l2nTbWfMg1pX5yK/IGN-%7C-WEBSITE--INTERNAL-?node-id=811-59110&m=dev)

## Requirements

### User Requirements

- [x] Block name: CC
- [x] Each card is an inner block with accent color background
- [x] Dark mode implementation from ContentWithMedia pattern
- [x] Tertiary button with arrow injection via `after` prop
- [x] Circular arrow hover state using CSS (not SVG)
- [x] Column options: 1, 2, or 3
- [x] Mobile: 1 column, Tablet: up to 2 columns
- [x] Swiper.js carousel integration

### Block Type Requirements

No block type requirements documented.

## Block Behavior

The CC block is a card carousel component designed for showcasing related content items with dark mode support.

### Layout
- Parent block (`takt/cc`) contains header section and Swiper carousel
- Child blocks (`takt/cc-item`) are individual cards rendered as slides
- Supports 1, 2, or 3 column layouts with responsive behavior:
  - **Mobile (< 570px):** Always 1 column
  - **Tablet (570px - 899px):** Up to 2 columns
  - **Desktop (>= 900px):** Full column count from attribute

### Content
- **Eyebrow:** Optional uppercase label above heading
- **Heading:** Section title (syncs to block name via `renameBlock`)
- **Description:** Optional paragraph below heading
- **Cards:** Each card has title, description, and button

### Media
- N/A - This block uses content cards, not media

### Conditional Behaviors
- **Dark Mode (`darkMode` attribute):** When enabled, section uses `dark bg-transparent!` classes and a pseudo-element charcoal background pattern
- **Navigation controls:** Can show/hide navigation arrows
- **Pagination:** Can show/hide pagination progressbar
- **Autoplay:** Optional autoplay with configurable delay

### Interactive States
- **Button hover:** Arrow gains circular charcoal background with neon-green arrow color
- **Carousel navigation:** Left/right arrows for manual navigation
- **Pagination progressbar:** Visual progress indicator with gradient fill

## Development Notes

### Design Decisions

1. **Dark mode pattern:** Followed ContentWithMedia exactly - using pseudo-element (`before:`) for the charcoal rounded background rather than wrapping in extra div
2. **Arrow injection:** Used existing ThemeButton `after` prop rather than modifying the component
3. **Carousel breakpoints:** Used container-based breakpoints (570px, 900px) to work well in constrained layouts

### Color Mapping

| Figma Element | Theme Token |
|---------------|-------------|
| Card background | `bg-accent` |
| Dark section background | `before:bg-charcoal` |
| Button text | `text-charcoal` |
| Hover arrow circle | `bg-charcoal` |
| Hover arrow icon | `text-neon-green` |

### Trade-offs

1. **Pagination gradient:** Used gradient (neon-green to blue) instead of solid color to match theme button patterns
2. **Navigation arrows:** Used SVG circles for navigation arrows (different from button arrow which uses CSS circle per spec)

### Deviations from Design

None significant. Implementation matches Figma within acceptable tolerances.

## Issues to Address

| ID | Severity | Status | Description |
|----|----------|--------|-------------|
| FQA-001 | Minor | Fixed | CRLF line endings converted to LF |
| FQA-002 | Minor | Fixed | Unused `columns` variable renamed with underscore prefix |

## Test Results

### Validation Summary

| Property | Value |
|----------|-------|
| **Last Test Type** | Full |
| **Overall Match** | Excellent |
| **Breakpoints Tested** | 375px, 768px, 1024px, 1440px |
| **Browsers Tested** | Chromium, Firefox, WebKit |
| **Variations Tested** | 9 variations |

### Screenshots

| Breakpoint | Chromium | Firefox | WebKit |
|------------|----------|---------|--------|
| 375px | [view](screenshots/cc-chromium-375w.png) | [view](screenshots/cc-firefox-375w.png) | [view](screenshots/cc-webkit-375w.png) |
| 768px | [view](screenshots/cc-chromium-768w.png) | [view](screenshots/cc-firefox-768w.png) | [view](screenshots/cc-webkit-768w.png) |
| 1024px | [view](screenshots/cc-chromium-1024w.png) | [view](screenshots/cc-firefox-1024w.png) | [view](screenshots/cc-webkit-1024w.png) |
| 1440px | [view](screenshots/cc-chromium-1440w.png) | [view](screenshots/cc-firefox-1440w.png) | [view](screenshots/cc-webkit-1440w.png) |

### Test Cases

| Test Case | Status | Notes |
|-----------|--------|-------|
| Default - Dark Mode with 3 Columns | PASS | Dark mode styling correct |
| Light Mode | PASS | No dark background, cards visible |
| 2 Columns Layout | PASS | Correct column count |
| 1 Column Layout | PASS | Full-width cards |
| No Controls | PASS | Navigation/pagination hidden |
| Cards Without Buttons | PASS | Buttons hidden correctly |
| Long Content Edge Case | PASS | Cards flex properly |
| Minimal Content | PASS | Works with minimal content |
| Autoplay Enabled | PASS | Carousel autoplays |

### What Matched

- [x] Card backgrounds use `bg-accent` (neon-green)
- [x] Dark mode pseudo-element pattern with `before:bg-charcoal`
- [x] Typography uses theme tokens (`text-header-5`, `text-body`)
- [x] Tertiary button with arrow via `after` prop
- [x] CSS circle on button hover (not SVG)
- [x] ArrowIcon.svg contains only chevron, no circle
- [x] Responsive column behavior
- [x] Swiper carousel with navigation and pagination
- [x] Context sharing between parent and child blocks

## Changelog

| Timestamp | Change |
|-----------|--------|
| 2026-02-01 21:08 PST | Initial block implementation |
| 2026-02-18 PST | Tertiary button arrow style update: Arrow now animates 12px right on hover/focus via margin transition (pre-reserved with `margin-right: 0.75rem`, transitions to `margin-left: 0.75rem; margin-right: 0`). Hover underline removed. Arrow wrapper class changed from inline Tailwind utilities to `btn-tertiary-arrow` CSS class. Animation handled globally in `resources/css/screen/button.css`. |
