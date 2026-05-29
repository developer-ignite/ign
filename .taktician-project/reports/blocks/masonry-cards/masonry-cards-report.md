# Block Report: Masonry Cards

**Date:** 2026-02-25 15:52 PST
**Test Page:** https://ign.localhost/test-masonry-cards/
**Figma Source:**
- [Desktop](https://www.figma.com/design/bpRK9A1l2nTbWfMg1pX5yK/IGN-%7C-WEBSITE--INTERNAL-?node-id=785-34519&m=dev)
- [Mobile](https://www.figma.com/design/bpRK9A1l2nTbWfMg1pX5yK/IGN-%7C-WEBSITE--INTERNAL-?node-id=785-34692&m=dev)

## Requirements

### User Requirements

- [x] Configurable column count (2, 3, or 4)
- [x] Responsive columns: 1 on mobile, 2 on tablet, selected count on desktop
- [x] Optional masonry-style staggered layout using CSS Grid
- [x] Cards as inner blocks with accent color background
- [x] Card minimum height of 256px
- [x] Text card with title and content
- [x] Text card title size adapts to character count
- [x] Text card tall option spanning two rows (title in one, content in other)
- [x] Image card with focal point support (same authoring as content-with-media)
- [x] Image card tall option spanning two rows
- [x] Tall cards maintain rounded-border split appearance in masonry mode
- [x] ThemeHeading integration (eyebrow, heading, description, buttons)
- [x] ARIA list semantics (role="list" on grid container, role="listitem" on cards)
- [x] ImageCard alt text attribute for author-controlled accessibility
- [x] Semantic HTML structure (section with aria-labelledby, heading hierarchy)

### Block Type Requirements

No block type requirements documented.

## Block Behavior

### Overview

The Masonry Cards block displays content in a grid of cards that can be arranged in standard rows or in a staggered "masonry" pattern. It contains a header section with optional text and buttons, followed by a grid of Text Cards and Image Cards.

### Header Section

- Optional eyebrow text appears as small text above the heading (hidden when left empty)
- Main heading for the section title
- Optional description text below the heading
- Up to 2 buttons at the bottom of the header
- Header content displays in a two-column layout on desktop

### Grid Layout

- Cards display in 2, 3, or 4 columns (selectable in sidebar settings)
- Single column on mobile, two columns on tablet, selected column count on desktop
- Standard layout arranges cards in simple rows
- Masonry layout creates a staggered pattern where cards vary in height

### Card Types

**Text Card:**
- Displays a title and body text on an accent-colored background
- Title size adapts to text length: short titles (10 characters or less) appear larger, longer titles appear smaller
- Can be toggled to "tall" mode which doubles the card height (only when masonry style is enabled)

**Image Card:**
- Displays a single image that fills the entire card
- Images can be repositioned using a focal point picker
- Authors can set custom alt text via a TextControl in the editor sidebar. When provided, the custom alt text overrides the media library alt text. When empty, the media library alt text is used (or the image is marked decorative with alt="")
- Can be toggled to "tall" mode which doubles the card height (only when masonry style is enabled)

### Masonry Style Behavior

When masonry style is enabled:
- Cards alternate between tall and short heights based on their position in the grid
- The pattern creates a staggered, visually interesting layout
- Cards marked as "tall" always span three rows regardless of their position
- The pattern adjusts based on column count (2, 3, or 4 columns each have their own pattern)

When masonry style is disabled:
- All cards display in uniform equal-height rows
- The "Tall Card" toggle is hidden in the editor for both text and image cards
- Any "tall" setting on individual cards is preserved in the data but has no visual effect

### Conditional Behaviors

- Header section is hidden when all header fields are empty
- Card grid area is hidden when no cards have been added
- Block name in editor list view matches the heading text
- Content placeholder shows in editor when editing but hides when empty on frontend

### Interactive Elements

- Cards can be added using the block appender
- Only Text Card and Image Card blocks can be added inside this block
- "Tall Card" toggle available in both toolbar and sidebar for each card
- Focus states: visible outline on focusable elements

### Accessibility

- Grid container has `role="list"` which tells screen readers this is a collection of related items
- Each card wrapper (both text and image) has `role="listitem"` which marks it as part of the card collection
- Screen readers announce the card grid as "list of N items" providing structural context
- Image cards include an "Alt Text" field in the inspector sidebar for authors to provide meaningful alt text to screen readers
- The parent section element automatically gets an `aria-labelledby` attribute that references the section heading, creating a proper labeled region landmark for assistive technologies
- Proper heading hierarchy: h2 for the section title, h3 for card titles

## Development Notes

### Design Decisions

**Masonry layout via CSS Grid with nth-child selectors:** CSS Grid subgrid would be ideal for true masonry behavior, but browser support remains limited. Instead, the implementation uses `nth-child` selectors to create repeating row-span patterns that simulate masonry. This approach works reliably across all browsers but requires cards to follow a predictable order.

**Three-row grid template for masonry mode:** The `auto-rows-[minmax(0,1fr)_48px_minmax(0,1fr)]` pattern creates a repeating three-row structure. The middle 48px row acts as a visual offset, allowing short cards (1 row-span) and tall cards (2 row-span) to create the staggered masonry effect without JavaScript.

**Tall card override with `!important`:** Tall cards use `!row-span-3` with `!important` to override the nth-child row-span patterns. This was necessary because the nth-child selectors have equal specificity to the tall card selector, and CSS cascade order couldn't reliably determine which should win. The `!important` ensures user intent (marking a card as tall) always takes precedence over the automatic pattern.

**Split pseudo-element background on tall text cards:** Tall text cards span the full grid height visually, but the middle 48px row creates a gap. Using `::before` for the top half and `::after` for the bottom half allows the accent background to appear continuous despite the grid gap.

**Gutenberg editor ::after conflict on tall TextCards:** WordPress Gutenberg applies `::after` pseudo-element styles to all block wrappers for selection outlines using the selector `.block-editor-block-list__layout .block-editor-block-list__block:not([contenteditable=true]):focus:after` with styles `position: absolute; inset: 0; z-index: 1; content: ""`. This conflicts with the TextCard's custom `::after` used for the bottom half of the split accent background on tall cards. When the block is selected in the editor, Gutenberg's higher-specificity selector overrides the block's `::after` styles, setting `z-index: 1` instead of `-1` and stretching it to cover the full card (inset: 0 instead of only the bottom half), causing the `::after` to render as a visible overlay on top of the card content. The fix in the TSX editor component adds Tailwind `!important` modifiers to the `::after` classes (`md:after:!absolute`, `md:after:!-z-1`, `md:after:!h-1/2`, `md:after:!top-auto`, `md:after:!bottom-0`, `md:after:!inset-x-0`) to override Gutenberg's default block `::after` styles. PHP does not need these overrides because the frontend never loads Gutenberg editor styles. This creates an intentional TSX/PHP difference — not a sync issue.

**Context-driven child card positioning:** Child cards (TextCard, ImageCard) receive layout context from the parent via WordPress block context. This keeps positioning logic in the child blocks where the classes are applied, rather than trying to target children from the parent.

**Typography token font-weight applied to TextCard titles:** TextCard titles previously used `font-bold` which applied a 700 font-weight, overriding the typography tokens (`text-header-1` and `text-header-3`) that define 400 font-weight. Removing `font-bold` allows the typography tokens to apply their intended weight. Note: Because Anton font (used for headings) is a single-weight typeface, there is no visual difference between font-weight 400 and 700, but the code now correctly reflects the intended design pattern of relying on typography tokens.

**ARIA list semantics for card collections:** The grid container uses `role="list"` and each card uses `role="listitem"` to establish semantic structure for screen readers. This is achieved using ARIA roles rather than native `<ul>/<li>` elements because the existing CSS Grid layout uses nth-child selectors for the masonry pattern. Converting to native list elements would require wrapping the grid in a `<ul>` and each card in an `<li>`, which would add extra markup layers and potentially interfere with the nth-child selectors. The ARIA approach provides the same semantic benefit (screen readers announce "list of N items") without changing the HTML structure.

**ImageCard alt text attribute with author control:** ImageCard blocks now have an `alt` attribute (string, default empty) that gives authors explicit control over image accessibility. The TextControl in the editor sidebar includes help text explaining both meaningful and decorative use cases. In the PHP template, the custom alt text is conditionally passed to `wp_get_attachment_image()` only when non-empty, allowing the media library alt text to be used as a fallback. This pattern respects author intent: if custom alt is provided, it takes precedence; if empty, the media library alt is used (or the image is marked decorative with `alt=""`).

**Theme utilities for HTML attributes in PHP:** TextCard and ImageCard use `theme_block_props()` with a second `$props` parameter to pass ARIA attributes. Rather than adding attributes directly to the HTML element, the attributes are passed as an array `[ 'role' => 'listitem' ]` as the second argument to `theme_block_props()`. This pattern keeps all HTML attribute generation in one place and ensures consistency with the editor (which also uses useBlockProps() with the same attributes).

**isTall toggle gating on masonryStyle:** The "Tall Card" toggle in both the editor toolbar and inspector sidebar is conditionally rendered only when the parent's `masonryStyle` is enabled. In the editor, this is achieved with `{masonryStyle && ...}` wrappers around the BlockControls and InspectorControls components. On the frontend, a derived variable (`$is_tall = $masonry_style && $isTall`) gates all tall-card CSS classes, ensuring no tall styling is applied when masonry is disabled. The underlying `isTall` attribute value is preserved in the saved data, allowing users to toggle masonry on and off without losing their tall-card preferences.

### Color Mapping

- Card backgrounds use `bg-accent` which resolves to the page's accent color via CSS custom properties
- The accent color system supports runtime color switching (neon-green, blue, green, yellow, orange, purple variants)
- No Figma-specific hex values were hardcoded; all colors flow through the theme's accent color system

### Trade-offs

**10-character threshold for title sizing:** Titles with 10 or fewer characters use the largest heading size, while longer titles use a smaller size. This threshold was chosen because typical short metric values like "90%", "$100K", or "500+" benefit from maximum visual impact, while descriptive titles like "Community Partners" need smaller text to avoid awkward line breaks.

**Fixed column patterns per breakpoint:** The 2-column, 3-column, and 4-column patterns each have hardcoded nth-child positioning. This means the visual rhythm is predictable but not infinitely flexible. Adding or removing cards may create visual gaps at certain counts.

**PHP uses `mb_strlen(strip_tags())` for title length:** The editor (TSX) checks `title.length` directly, but PHP strips HTML tags and uses multi-byte string length to ensure consistent behavior with special characters and any accidental markup.

### Deviations from Design

None. The implementation follows the Figma design's visual patterns while adapting the static layout to a responsive CSS Grid approach.

## Issues to Address

None.

## Test Results

### Validation Summary

| Property | Value |
|----------|-------|
| **Last Test Type** | Full |
| **Overall Match** | Excellent |
| **Breakpoints Tested** | 375px, 768px, 1024px, 1440px |
| **Browsers Tested** | Chromium, Firefox, WebKit |
| **Variations Tested** | 12 demo-container variations; 2-column, 3-column, 4-column layouts; Masonry and aligned grids; Tall cards; Mixed text and image cards |
| **Last QA Status** | Functional QA: PASS (10/10 checks), Design QA: PASS (excellent match with Figma, no visual regressions) |

### Screenshots

| Breakpoint | Chromium | Firefox | WebKit |
|------------|----------|---------|--------|
| 375px | [view](screenshots/masonry-cards-chromium-375w.png) | [view](screenshots/masonry-cards-firefox-375w.png) | [view](screenshots/masonry-cards-webkit-375w.png) |
| 768px | [view](screenshots/masonry-cards-chromium-768w.png) | [view](screenshots/masonry-cards-firefox-768w.png) | [view](screenshots/masonry-cards-webkit-768w.png) |
| 1024px | [view](screenshots/masonry-cards-chromium-1024w.png) | [view](screenshots/masonry-cards-firefox-1024w.png) | [view](screenshots/masonry-cards-webkit-1024w.png) |
| 1440px | [view](screenshots/masonry-cards-chromium-1440w.png) | [view](screenshots/masonry-cards-firefox-1440w.png) | [view](screenshots/masonry-cards-webkit-1440w.png) |

### Test Cases

Test page contains 12 demo-container variations with 54 total cards (mix of text and image cards):

| Test Case | Status | Notes |
|-----------|--------|-------|
| Our Impact at a Glance (3-col masonry, 6 cards) | Pass | Full header with eyebrow, heading, description, buttons; 4 text + 2 image cards |
| Features Overview (2-col aligned, 4 cards) | Pass | Non-masonry layout; 3 text + 1 image card |
| Advanced Capabilities (4-col masonry, 8 cards) | Pass | 8 text cards with various titles; extensive column configuration test |
| Minimal (no heading, 3 cards) | Pass | Header fields empty, grid visible; 3 text cards |
| Long Heading (3-col, 3 cards) | Pass | Stress test with extremely long heading text; layout handles gracefully |
| Testimonial Style (2-col, 2 cards) | Pass | Text cards only; different content types |
| Nested Content (3-col, 6 cards) | Pass | Mixed content with emphasis |
| Photo Gallery (4 image cards) | Pass | Image-only cards with focal point positioning; alt text handling |
| Mixed Collection (3-col, 8 cards) | Pass | Complex mix of text and image cards at various breakpoints |
| Single Item (1 card) | Pass | Edge case with minimal content; layout handles single item |
| Image Focal Points (3 image cards) | Pass | Focal point customization for each image |
| Variety Pack (6 text cards with tall variants) | Pass | Mix of regular and tall cards; title length variations |

### What Matched

**Layout**
- [x] Grid column configuration (2, 3, 4)
- [x] Masonry row-span patterns
- [x] Single column on mobile
- [x] Tall card spanning behavior

**Typography**
- [x] Dynamic title sizing
- [x] Content text styling
- [x] ThemeHeading hierarchy

**Colors**
- [x] Card background (bg-accent)
- [x] Text colors

**Components**
- [x] Image focal point positioning
- [x] Card border radius
- [x] Pseudo-element backgrounds on tall text cards

## Changelog

| Timestamp | Change |
|-----------|--------|
| 2026-01-30 11:41 PST | Updated Requirements from original spec; added Figma source URLs |
| 2026-02-12 16:07 PST | Removed font-bold from TextCard title classes; titles now use font-weight 400 from typography tokens |
| 2026-02-12 16:21 PST | Accessibility improvements: Added alt text attribute to ImageCard, added ARIA list semantics (role="list" on grid, role="listitem" on cards) |
| 2026-02-12 16:21 PST | Test page updated to demo-container style with 12 comprehensive variations covering all layouts, column counts, and content types |
| 2026-02-12 21:21 PST | Fixed Gutenberg editor bug: tall TextCard ::after pseudo-element rendered on top of content when block selected. Added !important modifiers to ::after classes in TSX to override WordPress default block ::after styles (editor only, PHP unchanged). |
| 2026-02-23 PST | Updated block.json example: viewportWidth 1400→1440. Fixed ImageCard inner block image URL from non-allowed picsum id 1015 to 704. Updated URL format to picsum.photos/id/{id}/{w}/{h}. Also updated standalone ImageCard example with image URL. |
| 2026-02-25 15:52 PST | Gated isTall toggle visibility and styling on parent's masonryStyle setting. When masonryStyle is false, the isTall editor toggle is hidden for both TextCard and ImageCard, and isTall styling is not applied in frontend rendering. isTall attribute value is preserved in saved data for better UX when toggling masonry on/off. Functional QA: PASS (10/10 checks). |
| 2026-03-06 PST | BH #28: Fixed ImageCard crash ("block cannot be displayed") when adding a new image. Root cause: `fetchMedia` (which uses React hooks internally) was called conditionally (`image?.id ? fetchMedia(image.id) : null`), violating the Rules of Hooks. When image.id changed from null to a number, the hook order changed and React crashed. Fix: call `fetchMedia(image?.id)` unconditionally, matching the pattern used by all other blocks. |
| 2026-03-06 PST | Added `__next40pxDefaultSize` to ToggleGroupControl and `__nextHasNoMarginBottom` to all ToggleControl instances in MasonryCards.tsx, ImageCard.tsx, and TextCard.tsx to fix WP 6.8 deprecation warnings. |
| 2026-03-09 PST | BH #80 #77 #74 #64 #62 #61 #47 #44 #35 #33 #32 #29 #27 #22 #17 #16 #15 #13 #12 #10: ThemeHeading spacing fixes. Heading-to-description spacing increased to 48px (`not-group-last:mb-12`), description-to-buttons spacing set to 32px (`not-last:mb-8`). Added `theme-heading` class to wrapper for tertiary button padding scoping. Tertiary buttons inside ThemeHeading now have `padding-top/bottom: calc(1rem + 1px)` to match primary/secondary touch area. |
| 2026-03-09 PST | Button row gap changed from `gap-4` to `gap-x-4 gap-y-2` (8px row-gap) on ThemeHeading buttons wrapper and ButtonRow block (PHP + TSX). |
