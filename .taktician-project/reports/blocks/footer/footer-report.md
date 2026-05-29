# Block Report: Footer

**Date:** 2026-02-20 13:57 PST
**Test Page:** https://ign.localhost/test-footer/
**Figma Source:** 928:19448

---

## Requirements

### User Requirements

- [x] Dark charcoal footer with rounded corners and gradient background
- [x] Top card section with logo, location info, hours, contact info, and social links
- [x] Navigation links section with multiple columns (up to 6 columns) and headings
- [x] Credits bar with legal links and copyright text
- [x] Responsive layout: stacks vertically on mobile, multi-column grid on desktop
- [x] Social icons support SVG and image formats
- [x] Optional fields with shouldDisplay() conditional rendering
- [x] Proper accessibility with semantic HTML, ARIA roles, and keyboard navigation
- [x] Dynamic copyright year
- [x] Fluid, responsive sizing for footer sections (flex-based layout without hard width constraints)

### Block Type Requirements

No block type requirements documented.

---

## Block Behavior

### Layout

The Footer block is a 9-block hierarchy organized into three main sections:

1. **FooterInfo** (top card) - Logo on left, location/hours/contact info on right, social media icons below
2. **FooterNav** (navigation section) - Up to 6 columns of navigation links with headings
3. **FooterCredits** (bottom bar) - Copyright text and legal links in a single row

On desktop, the footer content is constrained to the site container width. The navigation section displays as a multi-column grid. On mobile, all sections stack vertically with full-width layout.

The layout now uses fluid, flex-based sizing instead of fixed widths. The right info group (Hours/Contact/Follow Us) flexes to fit its content naturally. Address items use flexible widths that enforce a 2-per-row pattern on wider screens while adapting to narrow viewports. Column widths grow and shrink to fill available space proportionally.

### Content

**FooterInfo Section:**
- Logo image (SVG supported) displayed on the left
- Two address fields for multiple locations
- Hours of operation text
- Email and phone contact information
- Social media links with icons and optional labels
- All fields except addresses are optional

**FooterNav Section:**
- Multiple navigation columns (typically 6, but flexible)
- Each column has a heading and a list of links
- Column headings are associated with their link lists via aria-labelledby
- Links support external URLs and new tab behavior

**FooterCredits Section:**
- Dynamically generated copyright text with current year
- Multiple legal links (Privacy Policy, Terms of Use, etc.)
- Links separated by vertical separators
- Responsive order: copyright first on mobile, legal links first on desktop

### Conditional Behaviors

- Logo is hidden when not set
- Hours field is hidden when empty
- Contact info section is hidden when both email and phone are empty
- Social label text is hidden when not set
- Empty navigation columns are hidden
- All conditional rendering uses shouldDisplay() helper

### Interactive States

- All links show hover effects via color changes
- Social links support both icon+label and icon-only display modes
- Focus indicators visible for keyboard navigation
- Proper touch targets on mobile (minimum 44x44px)

---

## Development Notes

### Design Decisions

- **Manual rendering in Footer.php (DEC-001):** The parent Footer.php manually renders inner blocks to wrap FooterNav and FooterCredits in a shared container, matching Figma's unified bottom card design
- **Rounded corners (DEC-002):** Uses `rounded-3xl` (24px) for 25px Figma radius — standard Tailwind token, 1px difference imperceptible
- **Font mapping (DEC-003):** Uses `font-sans` (General Sans) instead of Roboto — theme defines General Sans; all blocks follow theme tokens
- **Gradient background (DEC-007):** Specific gradient doesn't map to simple Tailwind utility, implemented via inline style
- **Responsive breakpoints (DEC-009):** Changed FooterCredits breakpoints from sm: to md: per block-type doc pattern
- **ARIA labelledby (DEC-010):** Added aria-labelledby on FooterNavColumn <ul> for heading association — WAI-ARIA spec requires nav regions to be labeled
- **Accessible name fallback (DEC-011):** Added accessible name fallback for FooterInfoSocialItem — social links must have accessible name even if linkTitle is empty
- **Fluid layout approach (DEC-015):** Replaced fixed-width constraints with flex-based sizing using Tailwind flex utilities. Right info group uses `lg:flex-[0_1_auto]` to size based on children's intrinsic widths rather than a hard 640px. Hours/Contact/Social columns use `sm:flex-1 sm:min-w-36` to grow equally while maintaining a 144px minimum. Address items use `sm:flex-1 sm:min-w-48` to ensure 2-per-row on desktop while flexing to fill available space. This approach improves responsiveness across varying screen sizes without hardcoded width breakpoints.
- **Address field HTML escaping (DEC-016):** Address field uses `wp_kses_post()` for output (matching hoursContent and contactContent pattern) to allow `<br>` tags from the RichText editor. Address name remains `esc_html()` since it should not contain HTML.

### Color Mapping

| Element | Color | Notes |
|---------|-------|-------|
| Background | bg-charcoal | Dark charcoal with gradient overlay |
| Text | text-white | Primary text color |
| Links hover | text-accent | Theme-aware accent color |
| Social icons | currentColor | Inherits text color for theming |

### Trade-offs

- **Decorative shapes deferred (DEC-006):** Purely cosmetic, core functionality first
- **Responsive behavior inferred (DEC-008):** Stack sections vertically on mobile, 2-col nav grid on small screens
- **Gutenberg UI component styling (DEC-012):** Gutenberg interface-level components (Popover, InspectorControls) do not support Tailwind CSS classes. Use inline styles for padding and other styling on these components. Applied to FooterInfoSocialItem.tsx popover (padding: "16px" via inline style instead of className="p-4")
- **Template enforcement race condition fix (DEC-013):** The useEffect enforcing Footer's 3-block template originally subscribed to the entire nested block tree via `getBlocks(clientId)`. Any change in any descendant (including adding a FooterInfoSocialItem) triggered the effect, which called `replaceInnerBlocks` mid-insertion, racing against core-data's entity registration and causing "Cannot read properties of undefined (reading 'meta')" TypeError. Fixed by replacing the dependency with a `directChildrenKey` string computed from direct children's names and clientIds only. Deeply-nested changes no longer trigger the effect while template enforcement still works correctly for the Footer's direct children.
- **FooterInfoSocialItem component lightweight redesign (DEC-014):** Replaced manual `__experimentalLinkControl` + `Popover` + `BlockControls` link editing UI with `@taktdev/components` `Link` component (matching pattern used by FooterNavColumnItem and FooterCreditsItem). Deferred `IconPicker` rendering until block is selected — when unselected, renders lightweight static SVG fallback instead of mounting `MediaUpload`/`MediaUploadCheck`. Added explicit defaults in block.json: `logoId: null`, `iconSlug: ""`. Root cause of the earlier race condition: The heavy component tree triggered `editEntityRecord` before the entity record was ready during block insertion. The lightweight `Link` component and deferred `IconPicker` eliminate these core-data operations from the insertion lifecycle.

---

## Issues to Address

No blocking issues identified. All accessibility and block-type doc requirements have been addressed. Previously identified issue FQA-001 (empty logo anchor) has been resolved.

**Deferred items:**
1. **Decorative background shapes** - Abstract rotated shapes with mix-blend-mode (darken/hue) behind the footer content. These are purely decorative and can be added as static SVG/PNG assets in a polish phase.
2. **Logo asset** - Test page uses placeholder; actual IGNITE logo SVG needs to be uploaded.
3. **Social media icon SVGs** - No icons uploaded in test page; actual platform icons need to be provided.

---

## Test Results

### Validation Summary

| Property | Value |
|----------|-------|
| **Latest Build Status** | PASS |
| **Latest QA Status** | PASS (7/7 checks) |
| **Total Issues** | 0 |
| **Previous Minor Issues** | 1 (FQA-001 - resolved) |
| **Current Issues** | 0 |

### Screenshots

#### Full Validation (All Browsers - Latest Cycle)

| Breakpoint | Chromium | Firefox | WebKit |
|------------|----------|---------|--------|
| 375px | [view](screenshots/2026-02-20-135519/footer-chromium-375w.png) | [view](screenshots/2026-02-20-135519/footer-firefox-375w.png) | [view](screenshots/2026-02-20-135519/footer-webkit-375w.png) |
| 768px | [view](screenshots/2026-02-20-135519/footer-chromium-768w.png) | [view](screenshots/2026-02-20-135519/footer-firefox-768w.png) | [view](screenshots/2026-02-20-135519/footer-webkit-768w.png) |
| 1024px | [view](screenshots/2026-02-20-135519/footer-chromium-1024w.png) | [view](screenshots/2026-02-20-135519/footer-firefox-1024w.png) | [view](screenshots/2026-02-20-135519/footer-webkit-1024w.png) |
| 1440px | [view](screenshots/2026-02-20-135519/footer-chromium-1440w.png) | [view](screenshots/2026-02-20-135519/footer-firefox-1440w.png) | [view](screenshots/2026-02-20-135519/footer-webkit-1440w.png) |

### Test Cases

| Test Case | Status | Notes |
|-----------|--------|-------|
| Full Content (Figma Match) | Pass | All 6 nav columns, all 5 social links, logo, addresses, hours, contact info, and 3 legal links |
| Minimal Content | Pass | Only required fields populated. 1 nav column with 1 link, no social icons, no logo, minimal addresses |
| Long Content | Pass | Extended text in all fields. Long heading labels, long address entries, many hours lines, long email addresses, many nav links with very long titles |
| No Optional Fields | Pass | No logo, no social label, empty hours and contact. Tests shouldDisplay() behavior |
| Single Column Navigation | Pass | Only 1 nav column with a few links. Tests layout when grid has minimal content |
| Many Columns (8 Columns) | Pass | 8 nav columns to test grid wrapping behavior. Verifies the grid handles more than 6 columns gracefully |
| Fluid Layout - Desktop | Pass | Address items display 2 per row on 1024px and 1440px. Right info columns (Hours/Contact/Social) distribute space evenly. Right group container does not over-expand. |
| Fluid Layout - Tablet | Pass | At 768px, right group transitions to flex-row. Address items flex-wrap. Three columns in right group share available width equally. |
| Fluid Layout - Mobile | Pass | At 375px, all columns stack vertically. No horizontal overflow. Clean stacking across all 6 footer variations. |

### What Matched

**Accessibility**
- [x] FooterNavColumn aria-labelledby for heading association
- [x] FooterInfoSocialItem accessible name fallback
- [x] Semantic HTML structure (footer > sections > nav > ul > li)
- [x] Keyboard navigation functional

**Block-Type Doc Compliance**
- [x] All 48 checklist items reviewed and verified PASS
- [x] Parent block structure with dark background
- [x] TEMPLATE/REQUIRED patterns for inner blocks
- [x] Navigation containers with semantic HTML and ARIA
- [x] Link items with validation and PHP rendering
- [x] Social media items with ImageOrInlineSvg
- [x] Copyright section with dynamic year and legal links

**Functionality**
- [x] Responsive breakpoints (md: prefix per block-type doc)
- [x] Optional fields hidden via shouldDisplay()
- [x] Dynamic copyright year
- [x] Multi-column navigation grid
- [x] Social media icon rendering
- [x] Fluid flex-based sizing for responsive layout

---

## Changelog

| Timestamp | Change |
|-----------|--------|
| 2026-02-13 20:47 PST | Completed block-type doc review and accessibility fixes. Reviewed all 48 block-type doc checklist items (all pass). Fixed 7 accessibility/consistency issues (A11Y-001 through A11Y-007). Updated test page with DemoContainer wrappers and 6 variations. Changed page title from "TEST: Footer" to "Test: Footer". Note: "Files Created" section with 45 files documented initial implementation across 9 blocks (Footer, FooterInfo, FooterInfoSocial, FooterInfoSocialItem, FooterNav, FooterNavColumn, FooterNavColumnItem, FooterCredits, FooterCreditsItem). |
| 2026-02-18 16:10 PST | Editor-only improvements: Added openOnImageClick={false} to logo ImageDropUploader in FooterInfo.tsx to prevent media library opening on click. Added inlineSVG={true} to logo ImageDropUploader in FooterInfo.tsx to enable SVG inline rendering in editor. Added openOnImageClick={false} to social icon ImageDropUploader in FooterInfoSocialItem.tsx to prevent media library opening on click. Build and QA validation: PASS. |
| 2026-02-18 18:17 PST | Layout and styling refinements: Address layout updated with sm:flex-wrap and sm:w-[calc(50%-1rem)] to limit two addresses per row on desktop (FooterInfo.tsx and FooterInfo.php). Social media hover color changed from hover:text-blue to hover:text-accent for theme-aware accent color (FooterInfoSocialItem.tsx and FooterInfoSocialItem.php). Changes synced across TSX and PHP. Build and QA validation: PASS. |
| 2026-02-19 09:31 PST | Gutenberg UI component styling fix: Replaced Tailwind className="p-4" with inline style={{ padding: "16px" }} in FooterInfoSocialItem.tsx popover. Gutenberg interface-level components (Popover, InspectorControls) do not support Tailwind CSS classes; inline styles are required. Build and QA validation: PASS. |
| 2026-02-19 12:39 PST | Icon replacements and flex-wrap fix: 3 SVG icons replaced (FooterNavColumnItem with horizontal rectangle, FooterInfoSocial with three squares, FooterInfoSocialItem with single square). Added flex-wrap to social links container (FooterInfoSocial.tsx and FooterInfoSocial.php) to allow icons to wrap when there are too many. Fixed pre-existing no-nested-ternary lint error in FooterInfoSocialItem.tsx. Build and QA validation: PASS (9/9 checks). |
| 2026-02-19 12:47 PST | FQA-001 fix (empty logo anchor): FooterInfo.php logo anchor now conditionally renders. Uses `theme_output_svg_or_img($logoId, false)` to pre-check output before rendering the `<a>` wrapper. Empty anchors no longer appear when no logo is set. Re-QA validation: PASS (3/3 checks). FQA-001 resolved. 0 issues remaining. |
| 2026-02-19 14:14 PST | Race condition fix in Footer.tsx: The useEffect that enforces the Footer's 3-block template was subscribing to the entire nested block tree via `getBlocks(clientId)`. Any change in any descendant (including adding a FooterInfoSocialItem) triggered the effect, which called `replaceInnerBlocks` mid-insertion, racing against core-data's entity registration and causing "Cannot read properties of undefined (reading 'meta')" TypeError. Fix: replaced the dependency with a `directChildrenKey` string computed from direct children's names+clientIds only. Deeply-nested changes no longer trigger the effect. Template enforcement still works correctly for the Footer's direct children. Re-QA validation: PASS (3/3 checks). 0 issues. |
| 2026-02-19 14:44 PST | FooterInfoSocialItem rewrite to fix editEntityRecord race condition: Replaced manual `__experimentalLinkControl` + `Popover` + `BlockControls` link editing UI with `@taktdev/components` `Link` component (matches pattern used by FooterNavColumnItem and FooterCreditsItem). Deferred `IconPicker` rendering until block is selected — when unselected, renders lightweight static SVG fallback instead of mounting `MediaUpload`/`MediaUploadCheck`. Added explicit defaults in block.json: `logoId: null`, `iconSlug: ""`. Root cause: The heavy component tree triggered `editEntityRecord` before the entity record was ready during block insertion. The lightweight `Link` component and deferred `IconPicker` eliminate these core-data operations from the insertion lifecycle. Previous revision's `directChildrenKey` optimization in Footer.tsx was kept as a valid performance improvement. Re-QA validation: PASS (5/5 checks). 0 issues. |
| 2026-02-20 13:37 PST | Replaced fixed CSS widths (lg:w-[640px], sm:w-48, sm:w-[calc(50%-1rem)]) with fluid flex-based sizing in FooterInfo for responsive layout. Applied 5 changes: (1) right info group container now uses lg:flex-[0_1_auto] to size based on children's intrinsic widths; (2-4) Hours/Contact/Social columns use sm:flex-1 sm:min-w-36 to distribute space evenly with 144px floor; (5) address items use sm:flex-1 sm:min-w-48 to enforce 2-per-row on desktop while flexing fluidly. Improved responsiveness across all viewport sizes. Build and QA validation: PASS (7/7 checks). 0 issues. |
| 2026-02-20 13:54 PST | Fixed address field HTML escaping: changed `esc_html()` to `wp_kses_post()` for address output in FooterInfo.php so that `<br>` tags from RichText render as actual line breaks instead of literal text. Address name remains `esc_html()` since it should not contain HTML. Build and QA validation: PASS. |
| 2026-02-23 PST | Added example fields to all block.json files (Footer and all inner blocks: FooterNav, FooterNavColumn, FooterNavColumnItem, FooterCredits, FooterCreditsItem, FooterInfo, FooterInfoSocial, FooterInfoSocialItem). Section block uses viewportWidth 1440. |
| 2026-03-09 PST | Expanding background refactor and horizontal padding removal: (1) Footer.php charcoal wrapper now uses pseudo-element pattern (`before:absolute before:bg-charcoal before:rounded-[32px] before:-z-1 before:-inset-x-(--side-gutter) before:inset-y-0 md:before:-inset-x-8`) so charcoal card extends beyond container. Gradient stays on footer element (full-width). (2) FooterInfo: replaced `bg-charcoal rounded-3xl p-8` with extending pseudo + `py-8` in both TSX and PHP. (3) FooterNav: changed `p-8` to `py-8` in both TSX and PHP. (4) FooterCredits: changed `px-8 py-4` to `py-4` in both TSX and PHP. All horizontal padding removed so footer content aligns with other container blocks. |
