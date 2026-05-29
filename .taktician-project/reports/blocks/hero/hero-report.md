# Block Report: Hero

**Date:** 2026-02-25 15:10 PST
**Test Page:** https://ign.localhost/test-hero-block/
**Figma Source:**
- [Primary (Desktop)](https://www.figma.com/design/bpRK9A1l2nTbWfMg1pX5yK/IGN-%7C-WEBSITE--INTERNAL-?node-id=785-51426)
- [Primary (Mobile)](https://www.figma.com/design/bpRK9A1l2nTbWfMg1pX5yK/IGN-%7C-WEBSITE--INTERNAL-?node-id=785-52057)
- [Secondary (Desktop)](https://www.figma.com/design/bpRK9A1l2nTbWfMg1pX5yK/IGN-%7C-WEBSITE--INTERNAL-?node-id=785-50945)
- [Secondary (Mobile)](https://www.figma.com/design/bpRK9A1l2nTbWfMg1pX5yK/IGN-%7C-WEBSITE--INTERNAL-?node-id=785-52116)

## Requirements

### User Requirements

- [x] Two variations: primary (centered) and secondary (left-aligned)
- [x] Gradient background effect with accent color theming
- [x] Background image with progressive mask reveal
- [x] Primary variation has quick navigation inner block
- [x] Quick navigation with editable title, menu-based dropdown, and submit button
- [x] Secondary variation has CTA buttons instead of quick navigation
- [x] Gradient extends beyond block boundaries

### Block Type Requirements

No block type requirements documented.

## Block Behavior

### Layout

**Primary Variation:**
- Full-width hero with centered content
- Minimum height: min(700px, 100vh) with content aligned to the bottom
- Background image with gradient mask fade effect
- Optional quick navigation component at bottom
- Gradient extends beyond block using overflow-visible
- Gradient height adjusts dynamically: 150vh viewport height, capped by JavaScript to not exceed the parent <main> element's current height

**Secondary Variation:**
- Full-width hero with left-aligned content
- Minimum height: min(700px, 100vh) with content aligned to the bottom
- Background image with gradient mask fade effect
- CTA buttons instead of quick navigation
- Gradient height adjusts dynamically: 150vh viewport height, capped by JavaScript to not exceed the parent <main> element's current height

### Content
- Optional eyebrow text above heading (hidden when empty)
- Main heading (h1) with large display typography
- Description text below heading
- Buttons (secondary variation only)

### Quick Navigation (Primary only)
- Editable title text ("I Want Support With")
- Dropdown populated from custom links attribute (not WordPress menus)
- Links managed via sidebar LinkEditor with drag-drop reordering
- Submit button that redirects to selected page
- Can be toggled on/off via inspector control

### Conditional Behaviors
- Eyebrow hidden when empty
- Block name in editor list view syncs with heading text
- Quick navigation visibility controlled by toggle (primary only)
- Buttons only show on secondary variation

### Interactive States
- Button uses `btn-secondary` class with theme hover effects
- Dropdown and submit button have visible focus states for accessibility
- QuickNavigation select uses aria-label with fallback for empty title

### Accessibility Features
- Background images are decorative (alt='') since they're behind gradient overlays
- Proper heading hierarchy with h1 tag via ThemeHeading
- Section landmark with aria-labelledby linking to heading
- SVG icons hidden from screen readers
- Semantic HTML with keyboard-accessible interactive elements

## Development Notes

### Design Decisions

- **Custom links attribute** - Links stored directly in block attributes instead of WordPress menus. Managed via sidebar LinkEditor component with WordPress's native LinkControl for searching/adding pages and native HTML5 drag-drop for reordering. This keeps content self-contained within the block and provides a more intuitive editing experience.
- **Gradient extends beyond block** - Uses `overflow-visible` to allow gradient to continue past block boundaries per spec requirement.
- **Image mask** - CSS `mask-image` with linear gradient creates progressive fade effect on background image.
- **Primary hero mobile title size** - Title uses 40px (2.5rem) on mobile instead of the default 64px (4rem) for `text-header-0`, then scales to normal responsive sizing at md+ (768px). Applied via `headingClassName` with Tailwind arbitrary values.

### Color Mapping

- `#1e1e1c` (Figma dark) -> `bg-charcoal` (theme token)
- White text/borders -> `text-white`, `border-white`
- Gradient colors -> CSS custom properties (`--gradient-main`, etc.) controlled by page accent color

### Trade-offs

- **Dropdown width:** Figma shows fixed 300px width, implemented as flexible (`flex-1`) for better responsiveness across content variations.
- **Chevron icon size:** Figma shows 24px, kept at 20px for better visual balance with text.

### Texture Overlay Implementation

- **Grain texture on QuickNavigation:** Uses inline SVG noise pattern with feTurbulence filter as data URI background-image on overlay div. Applied mix-blend-mode: color-dodge with opacity: 0.08 to achieve subtle grain effect without external asset dependency. Implemented in both PHP and TSX with proper z-index layering (z-0 overlay, z-10 content).

### Accessibility Decisions

- **Background images alt text:** Forced alt='' on hero background images since they are purely decorative (behind gradient overlays and text content). Per WCAG guidelines, decorative images should have empty alt text rather than using media library descriptions.
- **QuickNavigation select accessible name:** Added fallback aria-label='Navigation' when title attribute is empty. This ensures the select always has an accessible name for screen readers.
- **Decorative icons:** SVG chevron icon hidden from screen readers with aria-hidden='true'.

### Gradient CSS Architecture (Revision 1)

- **Block-specific CSS:** Created `blocks/Hero/Hero.css` containing `.top-gradient` with position: absolute, height: 150vw, z-index: -10, and a 3-layer background using generic `--gradient-left`, `--gradient-right`, and `--accent-color` variables from the theme's generic gradient system.
- **Generic gradient system:** Uses theme-level variables in `colors.css` for color-specific overrides (--gradient-left, --gradient-right for each theme accent color: blue, yellow, orange, purple, green). Per-color gradient switching is now centralized in colors.css, not hero-specific.
- **Removed hero-specific code:** All hero-specific gradient rules and per-color overrides were removed from colors.css per block CSS architecture standards. The generic gradient system already handles all color variations.
- **Overflow control:** Added `overflow-y: clip` to `.wp-site-blocks` in body.css to prevent absolutely positioned gradients from extending the page scrollable area past the footer. Hero's own `overflow-visible` is preserved to allow gradient bleed between blocks within .wp-site-blocks.
- **Test page spacing:** Added 100vh spacer blocks inside each DemoContainer (11 total, except last) to test that gradient doesn't grow the page beyond content boundaries.

### Gradient Max-Height Capping with ResizeObserver (Revision 2)

- **Height change:** Updated `.top-gradient` height from `150vw` (viewport-width relative) to `150vh` (viewport-height relative). This makes the gradient scale based on viewport height instead of width.
- **JavaScript max-height capping:** Created `blocks/Hero/Hero.js` with a ResizeObserver pattern to cap the gradient's max-height to the parent `<main>` element's current height. The script finds each `.top-gradient` element's closest `<main>` ancestor (or falls back to `document.querySelector('main')`), then sets its inline `max-height` CSS property to match the `<main>` element's `offsetHeight` in pixels.
- **Dynamic updates:** The ResizeObserver continuously monitors the `<main>` element for size changes. When `<main>` resizes (due to content changes, accordion expansions, dynamic loading, etc.), the gradient's max-height is automatically updated to match, preventing the gradient from exceeding the `<main>` element's boundaries.
- **Multiple hero support:** Each hero block instance gets its own ResizeObserver via `querySelectorAll('.hero .top-gradient')` iteration in Hero.js. Multiple hero blocks on the same page are handled independently without conflicts, and the scoped selector prevents the ResizeObserver from targeting `.top-gradient` elements in other blocks that may share the same CSS class.
- **Bundling pattern:** Hero.js is bundled into `screen.js` via webpack glob pattern (matching `QuickNavigation.js` implementation pattern), not inline PHP output. This approach avoids PHP function validator false positives and cleanly handles multiple hero instances.

### Scoped Selectors Across Hero-Family Blocks (Revision 2, Final)

- **CSS scoping:** Hero.css now uses `.hero .top-gradient` selector (instead of global `.top-gradient`) to scope gradient styles to Hero blocks only. This prevents Hero.css styles from leaking to PostHero, EventHero, or other hero-family blocks that inherit the `hero` class.
- **JavaScript scoping:** Hero.js ResizeObserver selector uses `.hero .top-gradient` (scoped from global `.top-gradient`) to observe and manage max-height only for gradients inside Hero blocks. PostHero and EventHero have their own ResizeObserver implementations with their own scoped selectors (`.post-hero .top-gradient`, `.event-hero .top-gradient`), preventing cross-block observer conflicts.
- **Block independence:** Each hero-family block (Hero, PostHero, EventHero) now owns its own CSS file with scoped selectors and its own ResizeObserver script with scoped selectors. If Hero, PostHero, or EventHero are removed from the site, the remaining blocks continue to function independently without relying on shared styles or scripts from removed blocks.
- **Renamed hero-inner references:** PostHero and EventHero PHP files were updated to use their own naming conventions (e.g., `post-hero-inner`, `event-hero-inner`) instead of reusing the shared `hero-inner` class, further ensuring complete block independence.

### PostHero and EventHero Block Independence

- **Separate CSS files:** PostHero and EventHero have their own CSS files (PostHero.css, EventHero.css) with scoped selectors for their `.top-gradient` variants.
- **Separate ResizeObserver scripts:** PostHero and EventHero have their own bundled JavaScript files (PostHero.js, EventHero.js) with scoped ResizeObserver implementations.
- **No longer inherit from Hero:** These blocks no longer depend on Hero.css or Hero.js. They are fully independent implementations.

### Hero Content Bottom-Alignment (Revision 3)

- **Minimum height approach:** Changed `.hero-inner` to use `min-h-[min(700px,100vh)] flex flex-col` to ensure hero takes at least 700px height (capped at viewport height) and uses flexbox column layout.
- **Content layer bottom-alignment:** Content layer now uses `mt-auto` (flex margin-top auto) to push content to the bottom of the flexbox container. This replaces the previous large padding approach (`pt-[calc(var(--header-height)+180px)]` etc.).
- **Minimum safeguard padding:** Content layer retains `pt-[var(--header-height)]` as a minimum top padding to prevent overlap with the site header on very short viewports.
- **Both variations synced:** Layout changes apply to both primary (centered) and secondary (left-aligned) variations, which share the same `.hero-inner` wrapper.
- **Bottom padding retained:** `pb-8 sm:pb-16` preserves bottom spacing as specified in the design (32px mobile, 64px desktop).

## Issues to Address

### Minor Issue (Pre-existing)

**FQA-001:** Redundant null-coalescing on $buttons in Hero.php line 86
- Severity: minor
- Description: `$buttons ?? []` is not needed since block.json provides a default value for `buttons` and extract() guarantees the variable exists.
- File: blocks/Hero/Hero.php, line 86
- Suggested Fix: Change `$isSecondary ? ( $buttons ?? [] ) : []` to `$isSecondary ? $buttons : []`
- Note: Pre-existing, non-breaking, cosmetic only. Does not impact functionality.

## Test Results

### Validation Summary

| Property | Value |
|----------|-------|
| **Status** | PASS (Revision 3) |
| **Last Test Type** | Functional QA + Design QA |
| **Last QA Run** | 2026-02-25 15:08 PST |
| **Checks Passed** | 9/9 (Functional QA), All design checks (Design QA) |
| **Issues Found** | 1 minor (pre-existing, non-breaking) |
| **Overall Match** | Excellent |
| **Breakpoints Tested** | 375px, 768px, 1024px, 1440px |
| **Browsers Tested** | Chromium, Firefox, WebKit |
| **Variations Tested** | All 12 variations (primary/secondary with full/minimal/edge cases) |
| **Production Ready** | Yes |

### Screenshots

#### Revision 3 Validation (2026-02-25 15:05 PST)

| Breakpoint | Chromium | Firefox | WebKit |
|------------|----------|---------|--------|
| 375px | ![Mobile](screenshots/hero-chromium-375w.png) | ![Mobile](screenshots/hero-firefox-375w.png) | ![Mobile](screenshots/hero-webkit-375w.png) |
| 768px | ![Tablet](screenshots/hero-chromium-768w.png) | ![Tablet](screenshots/hero-firefox-768w.png) | ![Tablet](screenshots/hero-webkit-768w.png) |
| 1024px | ![Desktop (small)](screenshots/hero-chromium-1024w.png) | ![Desktop (small)](screenshots/hero-firefox-1024w.png) | ![Desktop (small)](screenshots/hero-webkit-1024w.png) |
| 1440px | ![Desktop](screenshots/hero-chromium-1440w.png) | ![Desktop](screenshots/hero-firefox-1440w.png) | ![Desktop](screenshots/hero-webkit-1440w.png) |

All screenshots show consistent content bottom-alignment across all hero variations: minimum height of min(700px, 100vh) is applied, content is pushed to the bottom using flexbox mt-auto, gradient height remains at 150vh properly capped to the <main> element's height by ResizeObserver JavaScript.

### Test Cases

| Test Case | Status | Notes |
|-----------|--------|-------|
| Primary variation - with image | Pass | |
| Primary variation - with quick nav | Pass | |
| Secondary variation - with image | Pass | |
| Secondary variation - with buttons | Pass | |
| Mobile responsive (375px) | Pass | Stacks vertically |
| Tablet responsive (768px) | Pass | |
| Desktop (1440px) | Pass | |
| Quick nav toggle | Pass | Shows/hides correctly |
| Empty eyebrow | Pass | Hidden when empty |
| Block rename sync | Pass | Updates with heading |

### What Matched

**Layout**
- [x] Primary centered layout
- [x] Secondary left-aligned layout
- [x] Responsive stacking on mobile
- [x] Gradient extends beyond block

**Typography**
- [x] Heading hierarchy (h1)
- [x] Anton font for headings
- [x] Body text sizing

**Colors**
- [x] Gradient background effect
- [x] Dark charcoal for quick nav box
- [x] White text on dark backgrounds

**Components**
- [x] QuickNavigation box styling
- [x] Button styling (btn-secondary)
- [x] Image mask fade effect

**QuickNavigation Specific**
- [x] Border radius (32px)
- [x] Padding (32px)
- [x] Gap between elements (48px)
- [x] Dropdown text size (20px)
- [x] Dropdown underline style (no border radius)
- [x] Solid white border on dropdown
- [x] btn-secondary button class

### Excluded Checks

None.

## Changelog

| Timestamp | Change |
|-----------|--------|
| 2026-01-27 19:00 EST | Initial block implementation |
| 2026-01-27 20:00 EST | Added QuickNavigation sub-block |
| 2026-01-30 11:30 PST | QuickNavigation fixes: border radius (24px -> 32px), padding (p-6/p-4 -> p-8), gap (gap-4/8 -> gap-12), dropdown text (text-base -> text-xl), dropdown border (white/30 -> white), button (inline styles -> btn-secondary) |
| 2026-01-30 11:50 PST | Fixed dropdown to show underline only (override global forms.css rounded-full with rounded-none!, border-0!, min-h-0!) |
| 2026-01-30 11:54 PST | Fixed dropdown border (border-t-0! border-x-0! instead of border-0!), removed cursor-pointer |
| 2026-01-30 13:00 PST | QuickNavigation: Replaced WordPress menu system with custom `links` attribute. Added LinkEditor component with native HTML5 drag-drop reordering and WordPress LinkControl for adding/editing links. |
| 2026-01-30 13:11 PST | QuickNavigation: LinkEditor UI improvements - primary wide Add Link button, card-style link items with border/shadow, icon buttons (pencil/trash) instead of text, grab cursor on items, popover aligned to item and positioned left of sidebar. |
| 2026-01-30 13:16 PST | QuickNavigation: Removed placeholder attribute and setting - dropdown now renders empty when no links exist. |
| 2026-01-30 13:30 PST | QuickNavigation: Button text now editable inline via RichText (removed sidebar setting), removed dropdown left padding, added black bg/white text to dropdown options. |
| 2026-01-30 13:45 PST | Fixed btn-secondary focus state in dark mode (text stays white on focus without hover). Added QuickNavigation dropdownBehavior attribute with 3 options: show first item, show placeholder, random on page load. |
| 2026-01-30 14:00 PST | QuickNavigation: Moved random selection JS from inline script to QuickNavigation.js file. |
| 2026-01-30 16:00 PST | Primary hero title font-size reduced to 40px (2.5rem) on mobile, scales to normal `--text-header-0` at md+ breakpoint. |
| 2026-02-13 14:48 PST | Updated test page: renamed from 'TEST: Hero Block' to 'TEST: Hero' (new naming standard), added 12 DemoContainer-wrapped variations with comprehensive coverage of all features and edge cases |
| 2026-02-13 14:52 PST | Fixed chevron icon size from 20px to 24px in IconChevron.svg per Figma spec (scaled path coordinates 1.2x) |
| 2026-02-13 14:52 PST | Added grain texture overlay to QuickNavigation using inline SVG noise pattern with mix-blend-mode: color-dodge and opacity 0.08 |
| 2026-02-13 14:52 PST | Accessibility improvements: forced alt='' on decorative background images, added fallback aria-label='Navigation' for QuickNavigation select when title is empty |
| 2026-02-13 15:31 PST | Accessibility review and testing complete: all requirements met, all bug fixes verified, test page updated to new standards with comprehensive variation coverage |
| 2026-02-13 16:59 PST | REVISION 1: Created blocks/Hero/Hero.css with .top-gradient using generic --gradient-left/--gradient-right variables from theme gradient system |
| 2026-02-13 17:00 PST | REVISION 1: Removed all hero-specific gradient code from colors.css (lines 143-206); kept generic gradient system for per-color overrides |
| 2026-02-13 17:00 PST | REVISION 1: Added overflow-y: clip to .wp-site-blocks in body.css to prevent gradient from extending page scrollable area beyond footer |
| 2026-02-13 17:00 PST | REVISION 1: Added 11 spacer blocks (100vh height) to test page inside DemoContainers to verify gradient doesn't grow page |
| 2026-02-13 17:29 PST | REVISION 1 QA Complete: Functional QA PASS (0 issues), Design QA PASS (0 issues), PostHero inherits changes via shared 'hero' class |
| 2026-02-18 PST | Added 3-button default template to block.json `attributes.buttons.default` (one primary, one secondary, one tertiary). New block instances now start with 3 button slots matching the ThemeHeading convention. Previously the `buttons` attribute had no default, just `"type": "array"`. |
| 2026-02-20 13:54 PST | Changed gradient height from 150vw to 150vh. Added Hero.js with ResizeObserver to cap gradient max-height to <main> element height, updating dynamically when <main> resizes. Follows QuickNavigation.js standalone JS bundling pattern. Functional QA PASS (1 minor note: missing @var docblock annotations). |
| 2026-02-20 14:10 PST | Scoped Hero.js ResizeObserver selector from global .top-gradient to .hero .top-gradient to prevent conflicts with other blocks (PostHero, EventHero) that also use .top-gradient. Functional QA PASS, 10/10 checks, 1 minor pre-existing @var docblock note. |
| 2026-02-20 14:32 PST | Made Hero block fully independent. Scoped .top-gradient CSS under .hero parent selector so Hero.css styles no longer leak to PostHero/EventHero. Renamed hero-inner references in sibling blocks. Each hero-family block now owns its own gradient styles. Functional QA PASS, 6/6 checks, 0 issues. |
| 2026-02-23 PST | Updated block.json example: viewportWidth 1400→1440, added picsum image URL (id/957) for hero image attribute. |
| 2026-02-25 15:10 PST | Changed hero minimum height to min(700px, 100vh) and aligned content to bottom via flexbox mt-auto. Replaced large top-padding approach with mt-auto on content layer, keeping pt-[var(--header-height)] as safeguard for header overlap prevention. Applied to both primary and secondary variations. Functional QA PASS (9/9 checks), Design QA PASS (all design checks). 1 minor pre-existing issue noted (redundant null-coalescing in PHP). |
| 2026-03-09 PST | BH #80 #77 #74 #64 #62 #61 #47 #44 #35 #33 #32 #29 #27 #22 #17 #16 #15 #13 #12 #10: ThemeHeading spacing fixes. Heading-to-description spacing increased to 48px (`not-group-last:mb-12`), description-to-buttons spacing set to 32px (`not-last:mb-8`). Added `theme-heading` class to wrapper for tertiary button padding scoping. Tertiary buttons inside ThemeHeading now have `padding-top/bottom: calc(1rem + 1px)` to match primary/secondary touch area. |
| 2026-03-09 PST | Button row gap changed from `gap-4` to `gap-x-4 gap-y-2` (8px row-gap) on ThemeHeading buttons wrapper and ButtonRow block (PHP + TSX). |
