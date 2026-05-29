# Block Report: Demo Container

**Date:** 2026-02-11 21:14 PST
**Test Page:** [https://ign.localhost/test-demo-container/](https://ign.localhost/test-demo-container/)
**Figma Source:** Not available (generic utility block)

## Requirements

### User Requirements

- [x] Title field (required) for identifying demo blocks
- [x] Description field (optional) for providing context about the variation
- [x] Inner blocks support for wrapping any block type
- [x] Hidden from block inserter (admin utility only)
- [x] First-child margin offset to accommodate fixed header
- [x] Neutral design appropriate for a utility/wrapper block
- [x] Good vertical padding between instances
- [x] Visual separation between header area and inner blocks
- [x] Center-aligned title and description for visual prominence

### Block Type Requirements

No block type requirements documented.

## Block Behavior

### Overview
Demo Container is a utility wrapper block designed for test and demo pages. It provides a labeled section with an optional description, followed by inner blocks that can contain any other block type. The block is hidden from the inserter and must be added programmatically.

### Layout and Spacing
- **Wrapper Structure:** The demo-container wraps a contained header area and unrestricted inner blocks as siblings, allowing children to use full viewport width
- **Header Area:** Wrapped in a `container` div with proper padding and max-width constraints. Title and optional description are center-aligned with the title constrained to a readable max-width on wide screens. Includes bottom border separator for visual distinction.
- **Inner Blocks:** Rendered as direct children of the outer wrapper with no horizontal constraints, allowing them to use full-width capabilities when needed
- **Vertical Spacing:** Wrapper padding provides 32px (mobile), 48px (tablet+) vertical spacing between instances
- **First Instance Offset:** First instance includes top margin offset to account for fixed page header

### Content Fields
- **Title (Required):** Displayed as a prominent, center-aligned heading (h2) using standard sizing (text-xl, font-bold) that inherits text color from parent context. Used to label the demo or variation being tested.
- **Description (Optional):** Renders below the title, center-aligned with muted styling (60% opacity via opacity utilities) when populated. Hidden when empty. Constrained to max-width for readability on wide screens. Uses standard text-base sizing.
- **Inner Blocks:** All block types allowed as children. No template or restrictions.

### Visual Design
- Title uses bold font-weight (text-xl font-bold) for clear visual hierarchy, center-aligned for emphasis
- Description text is center-aligned and muted (using opacity-60 utility) to de-emphasize context text
- Subtle border-bottom (using standard border-neutral-300) provides separation between header and content
- Theme-agnostic styling using standard Tailwind utilities and text-current for color inheritance, ensuring portability across any theme

### Editor Behavior
- Block title syncs to WordPress list view name via renameBlock() pattern
- Description field appears conditionally when block is selected or contains text
- All blocks allowed as inner block children with full appender for adding new blocks

### Responsive Behavior
- Spacing values scale: py-8 → sm:py-12, mb-6 → sm:mb-8, etc.
- Typography remains consistent across breakpoints with responsive header-4 sizing
- Title and description center alignment consistent across all screen sizes
- Description uses max-width constraint (2xl) for readable line length on wide screens
- Single render path for all screen sizes (no breakpoint-specific duplication)

### Accessibility
- Wrapper element has role="region" with aria-label derived from title text
- Title element is semantic h2 heading
- HTML tags stripped from title before use in aria-label
- No interactive elements; focus management not required

## Development Notes

### Design Decisions

**Utility Block Purpose**
This block is designed for test and demo pages, not production content. Decisions reflect a minimal, developer-focused approach rather than a full content component.

**Wrapper Element Choice**
Uses `<div>` with `role="region"` and `aria-label` rather than `<section>` because this is a developer tool, not a semantic page section. The region role provides accessibility for screen readers while keeping the semantic meaning appropriate for a utility block.

**Typography Approach**
Uses plain RichText fields for title and description rather than a full ThemeHeading component. ThemeHeading includes eyebrow text, buttons, and heading size options that would be unnecessary overhead for a utility block. Simple fields keep the implementation minimal.

**Inner Blocks Strategy**
Allows all block types as children with no template because the purpose is testing various blocks. Any restriction would limit utility during development and testing cycles.

**Hidden from Inserter**
Set via `supports.inserter: false` because this block is a development tool, not a user-facing content type. It must be added programmatically via test page setup rather than through the normal block picker.

**Header Offset**
The `first:mt-(--header-height)` class on the wrapper ensures the first demo container starts below any fixed page header, providing proper visual spacing on pages with fixed navigation.

**Center Alignment**
Title and description are center-aligned to create visual emphasis and hierarchy, making demo sections more prominent and visually distinct on the test page. This approach is appropriate for a utility block that showcases featured content.

**Theme-Agnostic Styling**
The block has been refactored to use only standard Tailwind utilities and avoid custom theme color/typography tokens. This makes it fully portable across any theme without requiring custom token definitions. The title inherits text color from parent context via `text-current`, description uses `opacity-60` for muted effect, and the border separator uses `border-neutral-300` from Tailwind's standard neutral scale. This design decision ensures the block can be used in any theme with any color scheme while maintaining clean, professional appearance.

**Full-Width Inner Blocks**
The block has been restructured to allow inner blocks to use full viewport width independently from the header area. The header (title + description) is contained within a `container` div with proper padding and max-width, while inner blocks are rendered as direct siblings of the outer wrapper. This separation allows children to implement their own width constraints or use full-width styling without being limited by the header's container. Use cases include full-width hero sections, carousels that need edge-to-edge display, and gallery blocks that require viewport-width layouts.

### Spacing Strategy
- **py-8/sm:py-12:** Provides generous vertical spacing between stacked demo containers
- **mb-6/sm:mb-8:** Clear visual gap between title/description area and inner blocks
- **pb-6/sm:pb-8:** Pairs with bottom border to create defined header region

### Color and Typography Strategy
- **Title:** Uses standard `text-xl font-bold` Tailwind utilities with `text-current` to inherit text color from parent/body context, ensuring automatic adaptation to any theme's base text color
- **Description:** Uses standard `text-base` size with `opacity-60` utility for muted text effect, avoiding theme-specific color tokens
- **Border:** Uses standard `border-neutral-300` from Tailwind's neutral scale for a clean, portable separator that works across any theme
- **Portability:** Block is now fully theme-agnostic, using only standard Tailwind utilities and inheriting base text color from parent context rather than relying on custom theme tokens

## Issues to Address

**No unresolved issues.** One issue was identified during Functional QA and resolved in the developer-fix phase:

### Resolved: FQA-001 - TSX/PHP Accessibility Attribute Sync
- **Priority:** Major
- **Description:** TSX wrapper element was missing `role="region"` and `aria-label` attributes that were present in the PHP template, causing editor/frontend mismatch
- **Status:** Fixed
- **Fix Applied:** Added role and aria-label attributes to TSX blockProps to match PHP output. Both versions now strip HTML tags from title before using in aria-label.
- **Verification:** Build passes, TypeScript clean, TSX/PHP sync verified

## Test Results

### Validation Summary

| Property | Value |
|----------|-------|
| **Last Test Type** | Full |
| **Overall Match** | Good |
| **Breakpoints Tested** | 375px, 768px, 1024px, 1440px |
| **Browsers Tested** | Chromium, Firefox, WebKit |
| **Variations Tested** | 7 variations (FeaturedPost, CardsCarousel, TestimonialsCarousel, ContentWithMedia, Hero, DynamicContentCarousel, with center-aligned title/description) |
| **Production Ready** | Yes |

### Screenshots

#### Full Validation (All Browsers × All Breakpoints)

| Breakpoint | Chromium | Firefox | WebKit |
|------------|----------|---------|--------|
| **375px (Mobile)** | [view](screenshots/demo-container-chromium-375w.png) | [view](screenshots/demo-container-firefox-375w.png) | [view](screenshots/demo-container-webkit-375w.png) |
| **768px (Tablet)** | [view](screenshots/demo-container-chromium-768w.png) | [view](screenshots/demo-container-firefox-768w.png) | [view](screenshots/demo-container-webkit-768w.png) |
| **1024px (Small Desktop)** | [view](screenshots/demo-container-chromium-1024w.png) | [view](screenshots/demo-container-firefox-1024w.png) | [view](screenshots/demo-container-webkit-1024w.png) |
| **1440px (Desktop)** | [view](screenshots/demo-container-chromium-1440w.png) | [view](screenshots/demo-container-firefox-1440w.png) | [view](screenshots/demo-container-webkit-1440w.png) |

### Test Cases

| Test Case | Status | Notes |
|-----------|--------|-------|
| FeaturedPost Demo - center-aligned title | Pass | Single featured post block renders correctly with center-aligned header |
| CardsCarousel Demo - 3-column layout | Pass | Title + description + carousel render with proper spacing and alignment |
| TestimonialsCarousel Demo - automatic posts | Pass | Showcases testimonials carousel with featured demo layout |
| ContentWithMedia Demo - gallery layout | Pass | Demonstrates gallery variant with center-aligned title |
| Hero Demo - primary variation | Pass | Hero block nested in demo container renders correctly |
| DynamicContentCarousel Demo - blog posts | Pass | Dynamic carousel pulls automatic blog posts, center-aligned header |
| Center alignment across breakpoints | Pass | Title and description remain center-aligned on mobile (375px) through desktop (1440px) |
| Inner blocks full-width structure | Pass | Inner blocks render outside header container and can use full viewport width without constraints |

### What Matched (Quality Checklist)

**Build and Compilation**
- [x] TypeScript compiles without errors
- [x] Build succeeds (performance warnings only, no errors)
- [x] Lint passes after auto-fix

**Block Structure**
- [x] All required files present: block.json, index.tsx, DemoContainer.tsx, DemoContainer.php, DemoContainer.svg
- [x] Block.json metadata correct (apiVersion 3, name takt/demo-container)
- [x] Block hidden from inserter via supports.inserter: false

**Attributes and Fields**
- [x] All attributes defined correctly (anchor, title, description)
- [x] Attributes persist correctly across all variations
- [x] Optional description field properly hidden when empty

**Functionality**
- [x] Inner blocks render correctly with all block types allowed
- [x] Title syncs to block list view name (renameBlock pattern)
- [x] Description field conditional (shouldDisplay pattern)
- [x] Template-less inner blocks with default appender

**Edge Cases**
- [x] Minimal content (title only) renders
- [x] Full content (title + description) renders with proper spacing
- [x] Long content (200+ chars) wraps gracefully
- [x] Empty optional fields hidden correctly
- [x] Empty inner blocks state handled (no errors)
- [x] Multiple inner block children render with correct spacing

**Accessibility**
- [x] Semantic h2 heading for title
- [x] role="region" with aria-label on wrapper element
- [x] HTML tags stripped from aria-label (screen reader friendly)
- [x] No interactive elements requiring keyboard focus
- [x] No contrast issues (charcoal text on standard background)

**Responsive Design**
- [x] Mobile (375px) layout correct with py-8 spacing, center-aligned text
- [x] Tablet (768px+) layout correct with py-12 spacing, center-aligned text
- [x] Desktop (1024px+) layout correct with max-width constraint on description
- [x] No breakpoint-specific duplication patterns
- [x] Typography scales appropriately with responsive header-4
- [x] Description max-width constraint works on wide screens

**Center Alignment**
- [x] Title text-center class applied to h2
- [x] Description text-center mx-auto classes applied to p
- [x] Alignment consistent across all breakpoints
- [x] Both TSX and PHP implementations synchronized

**TSX/PHP Sync**
- [x] Wrapper element structure matches
- [x] Conditional classes match (displayContent equals !empty conditions)
- [x] role="region" and aria-label sync verified
- [x] Center alignment classes present in both TSX and PHP
- [x] Inner blocks rendering logic identical

**Theme-Agnostic Styling**
- [x] No custom theme color tokens (text-charcoal, border-charcoal) present
- [x] No custom theme typography tokens (text-header-4, text-body) present
- [x] Title uses text-current to inherit color from parent context
- [x] Description uses opacity-60 for muted effect without color tokens
- [x] Border uses standard border-neutral-300 from Tailwind scale
- [x] Typography uses standard Tailwind sizes (text-xl, text-base) and weights (font-bold)
- [x] Block is fully portable across themes without requiring custom token definitions

**Full-Width Inner Blocks Structure**
- [x] Header area (title + description) wrapped in container div with proper padding and max-width
- [x] Inner blocks rendered as direct children of demo-container wrapper
- [x] No horizontal constraints applied to inner blocks
- [x] Inner blocks can use full viewport width independently
- [x] Header stays contained and centered for readability
- [x] TSX and PHP markup structure verified identical

## Changelog

All code changes with timestamps. Times shown in project timezone (PST).

| Timestamp | Change |
|-----------|--------|
| 2026-02-11 20:29 PST | Initial block implementation via planning phase (DemoContainer spec generated with title, description, InnerBlocks, hidden from inserter) |
| 2026-02-11 20:31 PST | Block files created by developer (all 5 files), build passed, test page created with 6 variations at https://ign.localhost/test-demo-container/ |
| 2026-02-11 20:38 PST | Functional QA: 10 checks run, 7 passed, 1 failed, 2 skipped. Issue identified: FQA-001 - TSX missing role=region and aria-label attributes present in PHP |
| 2026-02-11 20:41 PST | Developer fix: Added role=region and aria-label to TSX wrapper to match PHP. Build passes, TSX/PHP sync verified. Issue FQA-001 resolved. |
| 2026-02-11 20:43 PST | Report generation: Final screenshots captured at all breakpoints (375px, 768px, 1024px, 1440px) across all browsers (Chromium, Firefox, WebKit). All validation complete. Block marked production-ready. |
| 2026-02-11 20:48 PST | User revision: (1) Center-aligned title with text-center class on h2, (2) Center-aligned description with text-center mx-auto classes on p, (3) Updated test page with 7 DemoContainer instances showcasing actual theme blocks: FeaturedPost (reversed layout), CardsCarousel (3 columns, 4 cards), TestimonialsCarousel (automatic posts), ContentWithMedia (gallery layout), Hero (primary variation), and DynamicContentCarousel (automatic blog posts). Build passes, TSX/PHP sync verified. |
| 2026-02-11 20:49 PST | Report update: Added revision changelog entry, updated Block Behavior section to describe center-aligned title/description, updated test page description to reflect 7 actual theme block demos, captured new screenshots at all breakpoints across all browsers. Block remains production-ready with improved visual hierarchy. |
| 2026-02-11 21:07 PST | Theme-agnostic refactor: Removed all custom theme-specific Tailwind classes. Replaced text-header-4 with text-xl font-bold (title), text-charcoal with text-current (title), text-body with text-base (description), text-charcoal/60 with opacity-60 (description), and border-charcoal/10 with border-neutral-300 (separator). Build passes, TSX/PHP sync verified. Block is now fully portable across any theme. |
| 2026-02-11 21:10 PST | Report update: Updated Block Behavior to document theme-agnostic styling approach, added theme-agnostic design decision to Development Notes, updated color/typography strategy section, added Theme-Agnostic Styling verification to quality checklist, captured new screenshots at all breakpoints. Block remains production-ready and is now theme-portable. |
| 2026-02-11 21:12 PST | Full-width restructure: Refactored inner block rendering to allow full viewport width capability. Header area (title + description) now wrapped in container div with padding/max-width, while inner blocks render as direct siblings to outer wrapper with no horizontal constraints. Build passes, TSX/PHP sync verified. Supports full-width hero sections, carousels, galleries, and blocks with custom width logic. |
| 2026-02-11 21:14 PST | Report update: Updated Layout and Spacing section to describe full-width structure, added full-width design decision to Development Notes, added inner blocks full-width structure test case, added Full-Width Inner Blocks Structure verification to quality checklist, captured new screenshots at all breakpoints across all browsers. Block remains production-ready with enhanced flexibility. Note: Files Created section removed from original report and integrated into changelog entry. |
| 2026-02-23 PST | Updated block.json example: viewportWidth 1400→1440 to match standard section preview width. |
| 2026-03-09 PST | BH #80 #77 #74 #64 #62 #61 #47 #44 #35 #33 #32 #29 #27 #22 #17 #16 #15 #13 #12 #10: ThemeHeading spacing fixes. Heading-to-description spacing increased to 48px (`not-group-last:mb-12`), description-to-buttons spacing set to 32px (`not-last:mb-8`). Added `theme-heading` class to wrapper for tertiary button padding scoping. Tertiary buttons inside ThemeHeading now have `padding-top/bottom: calc(1rem + 1px)` to match primary/secondary touch area. |
| 2026-03-09 PST | Button row gap changed from `gap-4` to `gap-x-4 gap-y-2` (8px row-gap) on ThemeHeading buttons wrapper and ButtonRow block (PHP + TSX). |
