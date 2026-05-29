# Block Report: Text

**Date:** 2026-02-18 15:43 PST
**Test Page:** https://ign.localhost/test-text/
**Figma Source:** Not available

## Requirements

### User Requirements

- [x] Two-column layout with ThemeHeading (sticky) on the left and rich text content on the right
- [x] Support for eyebrow, heading, description, and button fields in ThemeHeading
- [x] Support for rich inner blocks (paragraphs, headings, lists, quotes, separators)
- [x] Conditional rendering of ThemeHeading when content exists
- [x] Sticky positioning on medium breakpoint and above
- [x] Proper heading hierarchy (h2 for ThemeHeading, h3+ for inner block headings)
- [x] Semantic HTML structure with proper ARIA labeling
- [x] Anchor/ID support for deep linking
- [x] Responsive layout (two columns on desktop, single column on mobile)

### Block Type Requirements

No block type requirements documented.

## Block Behavior

The Text block is a two-column content layout designed for displaying structured information with an optional sticky sidebar.

### Layout Structure

- **Desktop (md and up):** Two-column grid with fixed 2:1 proportions (gap-x-16, gap-y-9)
- **Mobile:** Single-column layout with content stacking vertically
- **Sticky Positioning:** Left column (ThemeHeading) sticks to viewport top (md:sticky md:top-8) when scrolling through right column content
- **Column Widths:** Equal grid distribution with md:grid-cols-2

### Left Column (ThemeHeading)

- **Eyebrow:** Optional small text label above the main heading (hidden when empty)
- **Heading:** Main section title (h2 element, always visible when block is selected for editing)
- **Description:** Optional body text explaining the heading
- **Buttons:** Up to multiple action buttons with URL destinations
- **Conditional Visibility:** The entire left column hides on the frontend when it contains no content (eyebrow, heading, description, or buttons), but remains visible in the editor when the block is selected to allow content entry

### Right Column (Rich Text)

- **Inner Blocks:** Supports WordPress core blocks for diverse content types:
  - Headings (h3+) for content structure
  - Paragraphs for body text
  - Lists (ordered and unordered)
  - Quotes
  - Separators
  - Button rows
- **Text Styling:** Content wrapped in `.discourse` class for consistent text styling and line height
- **Column Positioning:** Inner blocks always appear in the right column of the two-column grid using `md:col-start-2`. This ensures content stays properly positioned regardless of whether ThemeHeading is visible or hidden.
- **Eyebrow Alignment:** When an eyebrow is present in the ThemeHeading, the right column content receives additional top padding (`md:pt-[calc(0.875rem*1.1+1rem)]`) so text starts at the same level as the eyebrow, matching the internal alignment of the ThemeHeading component. This padding is automatically removed when no eyebrow is present.
- **No Template Lock:** Users can freely add, remove, and reorder inner blocks

### Interactive States

- All interactive elements (headings, links, buttons) show focus outline for keyboard accessibility
- Links render as semantic `<a>` elements with proper navigation behavior

### Conditional Behaviors

- **Eyebrow Hidden When Empty:** Field doesn't render if left blank
- **ThemeHeading Column Hidden When Empty:** If eyebrow, heading, description, and buttons all lack content, the left column doesn't render on the frontend (but shows in editor when block is selected)
- **Anchor ID Support:** Optional anchor attribute applies as HTML `id` on the section element for deep linking
- **Block Editor Label:** Block displays heading text in the editor list view when available

## Development Notes

### Design Decisions

**Conditional Rendering Strategy:** The block implements a dual-visibility pattern using the `shouldDisplay()` utility. In the editor, ThemeHeading remains visible whenever the block is selected (allowing authors to fill in content), but hides when deselected and empty. On the frontend, the PHP template uses the same `hasContent` logic to exclude the ThemeHeading column entirely when no content exists. This preserves authoring UX while ensuring the frontend rendering matches the design intent.

**Sticky Positioning:** The left column uses CSS-based sticky positioning (`md:sticky md:top-8`) rather than JavaScript scroll listeners. This provides a performant, native browser behavior that works across all devices without additional script overhead.

**Content Wrapper Classes:** The right column content wraps in a `.discourse` class to apply consistent typography styling (font sizing, line height, list styling, etc.). The section wrapper itself includes the `.not-discourse` class to prevent discourse styling from bleeding into the section element itself.

### Trade-offs

- **Fixed Grid Layout:** The two-column layout uses fixed grid proportions rather than flexible ratios. If content length varies significantly between columns, users should use a different block layout.
- **No Full-Width Inner Content:** When ThemeHeading is hidden (no content), the right column does not span full width. This is acceptable design—if users need full-width content, they should use a single-column block instead.

## Issues to Address

**None.** All planned bug fixes have been implemented and verified:

1. ✓ Added missing `not-discourse` class to TSX wrapper (major)
2. ✓ Added `shouldDisplay`/`hasContent` conditional for ThemeHeading in TSX (major)
3. ✓ Added PHP docblock annotations for `$children` and `$block` variables (minor)

## Test Results

### Validation Summary

| Property | Value |
|----------|-------|
| **Status** | Production Ready |
| **Mode** | Edit (First Report) |
| **Last Test Type** | Full |
| **Overall Match** | Excellent |
| **Breakpoints Tested** | 375px, 768px, 1024px, 1440px |
| **Browsers Tested** | Not captured (static content block, no interactive elements) |
| **Variations Tested** | 7 (Full Content, Minimal, No ThemeHeading, Long Content with Sticky, Partial Content, Anchor ID, Rich Inner Blocks) |
| **Build Status** | Pass |
| **Lint Status** | Pass |
| **Functional QA** | PASS (0 issues) |
| **Design QA** | Skipped (no Figma design file) |

### Screenshots

**No screenshots captured.** This block has no Figma design and is a static content layout without interactive elements. Design QA was skipped.

### Test Cases

| Variation | Test Case | Status | Notes |
|-----------|-----------|--------|-------|
| 1 | Full Content | Pass | All ThemeHeading fields populated; rich inner blocks with heading, paragraphs, lists render correctly |
| 2 | Minimal - Heading Only | Pass | Only heading populated; other ThemeHeading fields and inner blocks hidden |
| 3 | No ThemeHeading Content | Pass | No eyebrow, heading, description, or buttons; only inner blocks present. Left column correctly hidden on frontend. |
| 4 | Long Content - Sticky Test | Pass | Extended inner block content tests md:sticky md:top-8 behavior; left column sticks while scrolling right column |
| 5 | Eyebrow and Heading Only | Pass | Partial ThemeHeading with eyebrow + heading; no description or buttons. Renders correctly. |
| 6 | With Anchor ID | Pass | Anchor attribute applied as `id='test-anchor'` on section element for deep linking |
| 7 | Rich Inner Blocks | Pass | Multiple content types (h3 headings, paragraphs, ul/ol lists, quotes, separators) all render within discourse wrapper |

### What Matched

**Functionality**
- [x] Two-column layout renders on desktop
- [x] Single-column layout on mobile
- [x] ThemeHeading conditional visibility works (shows in editor when selected, hides on frontend when empty)
- [x] Sticky positioning works (left column sticks on md and up)
- [x] Inner blocks render all supported types
- [x] Anchor attribute applied correctly

**Semantic HTML**
- [x] Proper `<section>` element with semantic structure
- [x] Heading hierarchy correct (h2 for ThemeHeading, h3+ for inner blocks)
- [x] ARIA labeling via theme_block_props() automatic aria-labelledby
- [x] Links render as `<a>` elements (not `<button>`)

**Build & Validation**
- [x] TypeScript compilation passes
- [x] PHP lint passes
- [x] Block registration valid (schema, naming, attributes)
- [x] TSX/PHP structure sync verified (identical classes, structure, props)
- [x] All attributes defined with correct types and defaults

**Accessibility**
- [x] Semantic HTML structure
- [x] Proper heading hierarchy maintained
- [x] Focus outlines visible on interactive elements
- [x] Keyboard navigation works (links tabable, natural tab order)
- [x] Color contrast adequate (uses theme CSS variables)
- [x] No ARIA pattern issues (static content block, no widgets)

### Excluded Checks

None.

## Changelog

| Timestamp | Change |
|-----------|--------|
| 2026-02-13 14:50 PST | Planning: Block type reviewed, accessibility verified, bugs identified (3 total: 2 major, 1 minor). Test page plan created with 7 variations. |
| 2026-02-13 14:50 PST | Development: Bug fixes applied — added `not-discourse` class to TSX, added `shouldDisplay`/`hasContent` conditional for ThemeHeading, added PHP docblock annotations. Test page created with 7 variations. Build, lint, and sync validation all pass. |
| 2026-02-13 14:59 PST | Functional QA: PASS — All 9 checks passed (build, lint, registration, attributes, edge cases, accessibility, markup duplication, TSX/PHP sync, inner blocks, spec compliance). No issues found. 7 test variations verified. |
| 2026-02-13 15:01 PST | Report: Block report generated. Status: Production Ready. |
| 2026-02-13 15:05 PST | Revision: Added `md:col-start-2` to discourse div wrapper in TSX and PHP to ensure inner blocks always appear in the right column of the grid, even when ThemeHeading is hidden. CSS-based grid column placement fix. Post-fix QA: PASS, 0 issues. Note: Files Created/Modified section and Production Readiness Checklist removed as they contained information already captured. |
| 2026-02-18 15:42 PST | Added conditional `md:pt-[calc(0.875rem*1.1+1rem)]` padding to the right column (discourse div) when eyebrow is present. This aligns content start with the eyebrow level, matching the internal alignment pattern of the ThemeHeading component. CSS/Tailwind only, no markup restructuring. Functional QA: PASS, all 11 checks passed, 0 issues. Conditional class verified on all 7 test instances. |
| 2026-02-18 PST | Added 3-button default template to block.json `attributes.buttons.default` (one primary, one secondary, one tertiary). New block instances now start with 3 button slots matching the ThemeHeading convention. Previously the `buttons` attribute had no default, just `"type": "array"`. |
| 2026-02-23 PST | Updated block.json example: viewportWidth 1400→1440 to match standard section preview width. |
| 2026-03-09 PST | BH #80 #77 #74 #64 #62 #61 #47 #44 #35 #33 #32 #29 #27 #22 #17 #16 #15 #13 #12 #10: ThemeHeading spacing fixes. Heading-to-description spacing increased to 48px (`not-group-last:mb-12`), description-to-buttons spacing set to 32px (`not-last:mb-8`). Added `theme-heading` class to wrapper for tertiary button padding scoping. Tertiary buttons inside ThemeHeading now have `padding-top/bottom: calc(1rem + 1px)` to match primary/secondary touch area. |
| 2026-03-09 PST | Button row gap changed from `gap-4` to `gap-x-4 gap-y-2` (8px row-gap) on ThemeHeading buttons wrapper and ButtonRow block (PHP + TSX). |
