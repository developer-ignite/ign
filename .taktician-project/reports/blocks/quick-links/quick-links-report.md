# Block Report: Quick Links

**Date:** 2026-02-12 21:22 PST
**Test Page:** http://ign.localhost/test-quick-links/
**Figma Source:**
- [Desktop](https://www.figma.com/design/figma-source-link)

## Requirements

### User Requirements

- [x] Two-column layout with content on left, links on right
- [x] Each link is an inner block for easy reordering
- [x] Hover effect uses the accent color
- [x] Links have arrow icons positioned on the right
- [x] Responsive: stacks to single column on mobile

### Block Type Requirements

No block type requirements documented.

## Block Behavior

### Layout
- Two columns side by side on desktop (md breakpoint and above)
- Content column on the left with eyebrow, heading, description, and CTA button
- Links column on the right with vertically stacked link cards
- Stacks to single column on mobile

### Content
- Optional eyebrow text above heading (hidden when empty)
- Main heading for section title
- Body text for description
- Optional CTA buttons at the bottom

### Link Cards
- Each link is a separate inner block (`takt/quick-link-item`)
- Links can be reordered via drag-and-drop in the editor
- Each card shows link title with arrow icon
- Links can be internal (WordPress posts) or external URLs
- Option to open in new tab (via Link popup)
- Links column wrapped in `<nav>` landmark with `aria-label` for discoverability by assistive technology
- Link items use `<ul>`/`<li>` list semantics for improved screen reader navigation

### Conditional Behaviors
- Empty eyebrow, heading, or description fields are hidden
- Block name in editor list view matches the link title
- Links without title or URL are not rendered on frontend
- Screen readers announce external links with "(opens in new tab)"

### Interactive States
- Link cards change to accent background color on hover
- Link cards show accent border on hover
- Focus states mirror hover states for keyboard navigation with visible focus indicator
- No text underline on links

## Development Notes

### Design Decisions

- **Inner blocks pattern:** Each link is a separate `takt/quick-link-item` block rather than storing links as an array attribute. This enables drag-and-drop reordering and individual link editing.
- **Link component:** Uses `Link` from `@taktdev/components` which provides a built-in popover for URL/post selection, avoiding manual WordPress LinkControl setup.
- **Nav landmark pattern:** Links column wrapped in `<nav>` element with `aria-label` following WAI-ARIA landmarks pattern. Collections of navigational links should be wrapped in `<nav>` to be discoverable by assistive technology users navigating by landmarks.
- **List semantics:** Link items use `<ul>`/`<li>` list structure so screen readers announce list count and users can navigate using list shortcuts. This improves discoverability over plain `<div>` list structures.
- **Aria-label derivation:** Nav element uses heading attribute value as the aria-label, or falls back to "Quick links" if heading is empty. This provides contextual naming to distinguish from other navigation landmarks on the page.
- **Focus indicator strategy:** Removed `focus:outline-none` from PHP to preserve browser default focus ring alongside accent color changes. Provides clear visual feedback for keyboard navigation without custom outline replacement.
- **External link indication:** Screen readers announce external links with "(opens in new tab)" via sr-only text inside the link when `opensInNewTab` is true.

### Color Mapping

- `#1f1f1d → text-charcoal, border-charcoal` - Exact match to theme token
- `Hover state → bg-accent, border-accent` - As specified in design spec

### Trade-offs

- **Border radius:** Figma shows `rounded-[25px]`, implemented as `rounded-3xl` (24px) - close enough and consistent with theme system

### Deviations from Design

- None - implementation matches design intent

## Issues to Address

### Testing Limitation

**Status:** BLOCKED (WordPress API Unavailable)
**Description:** Functional QA phase could not verify rendered HTML output because WordPress API returned 500 Internal Server Error. All 5 accessibility improvements and 3 code quality fixes were verified in source code and build successfully passed, but rendered page verification is pending.
**Impact:** Cannot verify nav landmark rendering, list semantics in DOM, or screen reader announcements until test page is created and tested in browser.
**Next Steps:** Restore WordPress API access and create test page with 7 comprehensive scenarios (Full Content, Minimal Content, Long Content Edge Case, Many Link Items, Single Link Item, External Links, Empty Optional Fields)

## Test Results

### Validation Summary

| Property | Value |
|----------|-------|
| **Last Test Type** | Accessibility Review + Code Quality |
| **Build Status** | Pass |
| **QA Status** | Blocked (WordPress API unavailable) |
| **Breakpoints Tested** | N/A - Code-based validation only |
| **Browsers Tested** | N/A - Code-based validation only |
| **Accessibility Improvements** | 5 implemented |
| **Code Quality Fixes** | 3 applied |

### Screenshots

#### Full Validation (All Browsers)

| Breakpoint | Chromium | Firefox | WebKit |
|------------|----------|---------|--------|
| 375px | [view](screenshots/quick-links-chromium-375w.png) | [view](screenshots/quick-links-firefox-375w.png) | [view](screenshots/quick-links-webkit-375w.png) |
| 768px | [view](screenshots/quick-links-chromium-768w.png) | [view](screenshots/quick-links-firefox-768w.png) | [view](screenshots/quick-links-webkit-768w.png) |
| 1024px | [view](screenshots/quick-links-chromium-1024w.png) | [view](screenshots/quick-links-firefox-1024w.png) | [view](screenshots/quick-links-webkit-1024w.png) |
| 1440px | [view](screenshots/quick-links-chromium-1440w.png) | [view](screenshots/quick-links-firefox-1440w.png) | [view](screenshots/quick-links-webkit-1440w.png) |

### Test Cases

| Test Case | Status | Notes |
|-----------|--------|-------|
| Default - typical content | Pass | |
| Multiple link items | Pass | 4 links tested |
| Mobile responsive | Pass | Stacks correctly |
| Link hover state | Pass | Accent color applied |
| Keyboard navigation | Pass | Focus states work |

### What Matched

**Layout**
- [x] Two-column layout on desktop
- [x] Single column on mobile
- [x] Content/links ratio

**Typography**
- [x] Eyebrow styling (uppercase, small)
- [x] Heading uses Anton font (text-header-2)
- [x] Link titles use font-heading text-xl

**Colors**
- [x] Charcoal borders on link cards
- [x] Accent color on hover
- [x] Off-white background

**Components**
- [x] Button styling (btn-primary)
- [x] Arrow icons positioned correctly

## Changelog

| Timestamp | Change |
|-----------|--------|
| 2026-01-30 10:00 PST | Initial block implementation |
| 2026-01-30 10:30 PST | Fixed theme_block_props() usage in PHP (was passing array incorrectly) |
| 2026-01-30 10:45 PST | Added no-underline! to override base link styles |
| 2026-01-30 11:00 PST | Added focus states for keyboard accessibility |
| 2026-01-30 11:15 PST | Changed breakpoint from lg: to md: to match project conventions |
| 2026-01-30 11:30 PST | Switched from manual LinkControl to Link component from @taktdev/components |
| 2026-01-30 11:45 PST | Moved SVG to resources folder, fixed PHP path to theme_block_asset('IconArrow.svg') |
| 2026-01-30 12:00 PST | Removed sidebar InspectorControls (opensInNewTab already in Link popup) |
| 2026-01-30 12:15 PST | Fixed arrow positioning - moved outside Link's after prop to be sibling element |
| 2026-01-30 13:51 PST | Full validation with updated report format |
| 2026-02-12 21:22 PST | Accessibility Review + Code Quality: Added 5 accessibility improvements (nav landmark, ul/li semantics, aria-label, removed focus:outline-none, sr-only text for external links) and fixed 3 code quality issues (removed manual attribute extraction, added @var docblocks) |
| 2026-02-18 PST | Added 3-button default template to block.json `attributes.buttons.default` (one primary, one secondary, one tertiary). New block instances now start with 3 button slots matching the ThemeHeading convention. Previously the `buttons` attribute had no default, just `"type": "array"`. |
| 2026-02-23 PST | Updated block.json example: viewportWidth 1400→1440 to match standard section preview width. |
| 2026-02-23 PST | Replaced block icon SVG to match project standard: fill-based layout representation with two-column structure (text content left, stacked link cards right) inside a section container outline. Removed stroke-based approach. |
| 2026-03-09 PST | BH #80 #77 #74 #64 #62 #61 #47 #44 #35 #33 #32 #29 #27 #22 #17 #16 #15 #13 #12 #10: ThemeHeading spacing fixes. Heading-to-description spacing increased to 48px (`not-group-last:mb-12`), description-to-buttons spacing set to 32px (`not-last:mb-8`). Added `theme-heading` class to wrapper for tertiary button padding scoping. Tertiary buttons inside ThemeHeading now have `padding-top/bottom: calc(1rem + 1px)` to match primary/secondary touch area. |
| 2026-03-09 PST | Button row gap changed from `gap-4` to `gap-x-4 gap-y-2` (8px row-gap) on ThemeHeading buttons wrapper and ButtonRow block (PHP + TSX). |
