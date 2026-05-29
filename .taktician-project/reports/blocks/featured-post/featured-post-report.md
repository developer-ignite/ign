# Block Report: Featured Post

**Date:** 2026-02-13 15:13 PST
**Test Page:** https://ign.localhost/test-featured-post/
**Figma Source:**
- [Desktop](https://www.figma.com/design/bpRK9A1l2nTbWfMg1pX5yK/IGN-%7C-WEBSITE--INTERNAL-?node-id=811-59175&m=dev)

---

## Requirements

### User Requirements

- [x] Two-column layout with media on one side and content on the other
- [x] Column reversal (media left or media right)
- [x] Row reversal for mobile stacking order
- [x] Dark mode variant with charcoal card backgrounds
- [x] Topic tag pill showing the post's first category
- [x] Post title rendered as heading (dynamic, not editable)
- [x] Post excerpt rendered as body text (dynamic, not editable)
- [x] Featured image from selected post
- [x] CTA button linking to the post permalink with editable label
- [x] Optional eyebrow text alongside topic tag pill
- [x] Heading size toggle (H2 regular / H3 small)
- [x] Post selector in sidebar for choosing which post to feature
- [x] Empty state handling when no post is selected
- [x] PHP early return when post is missing or unpublished

### Block Type Requirements

No block type requirements documented.

---

## Block Behavior

### Layout
- Two columns side by side on desktop (768px and above), stacking to a single column on mobile
- Media can be positioned on the left or right using a column reversal toggle in the toolbar
- On mobile, the stacking order can also be reversed so content appears above or below the image
- Dark mode wraps both the content and media columns in charcoal rounded cards that extend beyond the content edges

### Content
- The block features a single selected blog post, pulling its data automatically
- A topic tag pill appears at the top of the content area, displaying the post's first category name in a green badge
- An optional eyebrow text field can be shown next to the topic tag pill for additional context
- The post title appears as the main heading (either H2 or H3 depending on the heading size setting)
- The post excerpt appears as body text below the heading
- A call-to-action button links to the full post, with an editable label (defaults to "Learn More")

### Media
- The post's featured image is displayed in a 4:3 aspect ratio container
- Images use `default-mask` CSS class for the rounded shape
- No video support -- the block is image-only by design

### Conditional Behaviors
- When no post is selected, the editor shows a placeholder prompting the user to select a post from the sidebar
- If the selected post is deleted or unpublished, the block does not render on the frontend
- The eyebrow text is hidden when left empty
- The block name in the editor list view updates to match the selected post's title

### Interactive States
- The CTA button follows the theme's primary button styling, which inverts colors in dark mode (white button with charcoal text)
- The CTA link includes a descriptive aria-label combining the button text with the post title for improved screen reader context (e.g., "Learn More: Building Bridges")

### Accessibility
- **Image alt text:** The featured image uses the WordPress media library's alt text as-is, via `wp_get_attachment_image()` native handling. Content editors set image alt text in the media library; the block respects that metadata directly. Images may contain content not conveyed by the post title and should have appropriate alt text set by editors.
- **CTA link context:** Each call-to-action link has an aria-label that combines the button label with the post title, ensuring screen readers can distinguish between multiple Featured Post blocks on the same page

---

## Development Notes

### Design Decisions

- **Cloned from ContentWithMedia** -- The block reuses the same two-column grid, column reversal (`md:col-start-*`), row reversal, and dark mode patterns from ContentWithMedia, as instructed by the spec (DEC-001)
- **Custom content layout instead of ThemeHeading** -- ThemeHeading expects editable RichText fields, but this block needs read-only post data plus a topic tag pill. A custom layout was more appropriate than forcing ThemeHeading into a different pattern (DEC-010)
- **PostSelectorSortable with limit=1** -- Uses the existing `@taktdev/components` post selector configured for single selection, which returns a post ID number rather than an array (DEC-007)
- **No play button overlay** -- The Figma design showed play buttons on images (carried over from ContentWithMedia), but the spec explicitly states no video support is needed (DEC-012)
- **Eyebrow kept as editable field** -- Although the topic tag pill displays the post's category, the Figma also shows an eyebrow text area next to it. Keeping it editable provides flexibility for additional context (DEC-011)

### Color Mapping

- `#eeffb5 -> bg-accent-lighter` - Topic tag pill background (neon-green-20)
- `#d4ff45 -> border-accent` - Topic tag pill border (neon-green)
- Pill text uses `text-charcoal` explicitly to prevent white text inheritance in dark mode (DEC-013)
- Dark mode card backgrounds use `bg-charcoal` via pseudo-elements, matching the existing ContentWithMedia pattern

### Trade-offs

- **Image aspect ratio**: Figma shows images at approximately 624x677 (near 1:1.08), but the implementation uses `aspect-[4/3]` (1:0.75) to match ContentWithMedia's single image layout for consistency across blocks. The image appears wider and shorter than Figma (DEC-009)
- **Dark mode texture**: Figma dark cards have a subtle noise texture overlay (8% opacity). The implementation uses solid charcoal backgrounds. The visual difference is negligible at normal viewing distance

### Accessibility Improvements

- **Image alt text (Revision 1):** Featured image alt attribute is handled natively by `wp_get_attachment_image()`, which reads the media library's alt text directly. Removed redundant manual alt text lookup that forced empty string fallback. Now respects whatever alt text content editors set in the WordPress media library. Images may contain content not described by the post title (e.g., people, places, objects), so they should have appropriate alt text provided by editors.
- **CTA link aria-label:** Each call-to-action link includes an aria-label attribute combining the button label with the post title (e.g., "Learn More: Building Bridges"). This satisfies WCAG 2.1 SC 2.4.4 (Link Purpose) by ensuring the purpose of each link can be determined from the link text alone or with programmatically determined context, even when multiple Featured Post blocks appear on the same page.
- **Excerpt escaping:** Post excerpt uses `wp_kses_post()` instead of `esc_html()` to prevent double-escaping HTML entities while maintaining security.
- **Auto-extracted attributes:** PHP template uses auto-extracted block attributes from the render_callback's `extract($attributes, EXTR_SKIP)` call, with @var docblock annotations documenting all camelCase attribute variables ($selectedPost, $isReversed, $reverseRows, $darkMode, $buttonLabel, $headingSize, $eyebrow). This follows the theme's conventions and eliminates redundant manual extraction code.
- **CSS self-containment:** Full audit confirms all CSS classes used in FeaturedPost come from Tailwind v4 utilities or theme-level CSS files (colors.css, typography.css, spacing.css, button.css). No dependencies on CSS from other blocks (Hero, ContentWithMedia). No inline styles or mask-image usage.
- **No inline masks:** FeaturedPost contains zero inline style attributes and zero mask-image usage. Image mask styling concerns identified during revision apply to the PostHero block, not FeaturedPost.
- **theme_block_props() pattern (Revision 2):** The PHP template uses `theme_block_props()` helper which accepts conditional class arrays directly. The helper calls `class_name()` internally, so do NOT wrap arrays in `class_name()` before passing. Correct usage: `theme_block_props(['featured-post' => true, 'dark' => $darkMode])`. Incorrect (double-call): `theme_block_props(class_name(['featured-post' => true, 'dark' => $darkMode]))`.

### Deviations from Design

- **Image aspect ratio** -- Uses 4:3 instead of Figma's taller proportion, for consistency with ContentWithMedia (documented above)
- **Heading line-height** -- Theme's `text-header-2` uses 1.2 line-height vs Figma's 1.1. This is a theme-level design system choice, not a block-level deviation
- **Container alignment** -- Figma uses `items-center` on the grid container; implementation uses `items-stretch` with `flex items-center` on the content column. Visual result is equivalent

---

## Issues to Address

All identified issues have been resolved. The initial edit cycle (2026-02-13) addressed 5 bugs and 3 functional QA items. Revision 1 (2026-02-13) reverted the alt text approach based on user feedback.

### Resolved in Latest Update (2026-02-13)

**Accessibility & Sync Issues (All Resolved)**

1. **FP-001: Image alt text fallback** (Revised in Revision 1)
   - Initial fix (2026-02-13): Changed featured image alt text fallback from post title to empty string
   - Revision 1 revert (2026-02-13): Removed manual alt text override entirely. Now uses `wp_get_attachment_image()` native behavior which reads directly from WordPress media library.
   - Rationale: User feedback indicated that images may contain content not described by the post title and should use the media library alt text as-is, set by content editors.

2. **FP-002: CTA link aria-label** (Fixed)
   - Added aria-label to call-to-action link combining button text with post title
   - Improves screen reader context for distinguishing multiple Featured Post blocks on the same page

3. **FP-003: TSX/PHP sync on alt text** (Fixed, then Revised in Revision 1)
   - Initial fix (2026-02-13): Synchronized TSX with PHP to both use empty string fallback
   - Revision 1 (2026-02-13): Reverted to use WordPress media library alt text natively
   - Both TSX and PHP now respect media library metadata via `wp_get_attachment_image()` and REST API

4. **FP-004: Excerpt double-escaping** (Fixed)
   - Changed from `esc_html()` to `wp_kses_post()` to prevent double-escaping HTML entities

5. **FP-005: Test page format** (Fixed)
   - Updated test page from 8 raw blocks to 10 DemoContainer-wrapped variations
   - Converted from non-self-closing block markup with HTML wrappers to self-closing format (`/-->`)

**Functional QA Issues (All Resolved)**

6. **FQA-001: Manual attribute extraction** (Fixed)
   - Removed redundant manual attribute extraction in PHP
   - Now uses auto-extracted variables from theme's render_callback `extract($attributes, EXTR_SKIP)`
   - Follows theme convention

7. **FQA-002: Missing @var docblock** (Fixed)
   - Added @var docblock annotations for all auto-extracted camelCase attribute variables
   - Suppresses PHP_CodeSniffer warnings for block attribute variables

8. **FQA-003: Unused variable** (Fixed)
   - Removed unused `postPermalink` variable from TSX editor component
   - Eliminated lint error

### Revision 1 (2026-02-13) - User Feedback & Audits

**User Request:** Address 3 concerns:
1. Revert alt text to use WordPress media library alt as-is
2. Verify CSS is self-contained (no dependencies on other blocks)
3. Confirm no inline mask styles in this block

**Planning Findings:**
- FPR1-001: Alt text override was redundant. `wp_get_attachment_image()` already handles alt text natively.
- CSS Audit: PASS - All classes from Tailwind v4 or theme CSS (colors.css, typography.css, spacing.css, button.css). Zero cross-block dependencies. Hero.css only defines `.top-gradient` (unused here).
- Mask Audit: PASS - FeaturedPost has zero inline styles and zero mask-image usage. Mask styling exists in PostHero block, not FeaturedPost.

**Developer Fix:**
- Removed manual `$img_alt` lookup from PHP
- Removed `'alt'` key override from `wp_get_attachment_image()` attributes array
- WordPress now handles alt text directly from media library metadata
- Build passes. TSX/PHP sync verified. No functional changes to layout/styling.

**Functional QA Verification:**
- Alt text verified from media library across all 10 test variations
- All images render with correct alt text values
- No regressions in layout, styling, or other features
- Code simplified by removing 2 lines of redundant code

**Status:** All Revision 1 concerns addressed and verified. Block is production-ready.

---

## Test Results

### Validation Summary

| Property | Value |
|----------|-------|
| **Last Test Type** | Full |
| **Overall Match** | Good |
| **Breakpoints Tested** | 375px, 768px, 1024px, 1440px |
| **Browsers Tested** | Chromium, Firefox, WebKit |
| **Variations Tested** | Default, Reversed, Dark mode, Dark mode + Reversed, Small heading (H3), With eyebrow, Reverse rows, Long button label, All options combined, Dark mode + Eyebrow + Reverse rows |

### Screenshots

#### Full Validation (All Browsers) - Latest Edit Cycle (10 DemoContainer-Wrapped Variations)

| Breakpoint | Chromium | Firefox | WebKit |
|------------|----------|---------|--------|
| 375px | [view](screenshots/featured-post-chromium-375w.png) | [view](screenshots/featured-post-firefox-375w.png) | [view](screenshots/featured-post-webkit-375w.png) |
| 768px | [view](screenshots/featured-post-chromium-768w.png) | [view](screenshots/featured-post-firefox-768w.png) | [view](screenshots/featured-post-webkit-768w.png) |
| 1024px | [view](screenshots/featured-post-chromium-1024w.png) | [view](screenshots/featured-post-firefox-1024w.png) | [view](screenshots/featured-post-webkit-1024w.png) |
| 1440px | [view](screenshots/featured-post-chromium-1440w.png) | [view](screenshots/featured-post-firefox-1440w.png) | [view](screenshots/featured-post-webkit-1440w.png) |

### Test Cases (10 DemoContainer-Wrapped Variations)

| Test Case | Post | Status | Notes |
|-----------|------|--------|-------|
| Default - Full Content | 122 | Pass | All fields auto-populated, default layout with media on left, content on right |
| Reversed Columns | 122 | Pass | isReversed=true, content on left, media on right, custom button "Read Full Story" |
| Dark Mode | 121 | Pass | Dark mode with charcoal pseudo-element backgrounds, white text, accent pill colors preserved |
| Dark Mode + Reversed | 120 | Pass | Dark mode + reversed columns, custom button "Explore This Story" |
| Small Heading (H3) | 122 | Pass | headingSize=small renders post title as H3 instead of H2 |
| With Eyebrow Text | 121 | Pass | Optional eyebrow text "Work Integrated Learning Initiative" displays next to topic tag pill |
| Reverse Rows (Mobile Order) | 120 | Pass | reverseRows=true, content appears above image on mobile |
| Long Button Label | 119 | Pass | Long CTA text "View Full Article on Our Blog" renders correctly without layout issues |
| All Options Combined | 119 | Pass | Dark mode + reversed + small heading + eyebrow + custom button label all together |
| Dark Mode + Eyebrow + Reverse Rows | 122 | Pass | Dark mode with eyebrow text and reverse row order on mobile |

### What Matched

**Layout**
- [x] Two-column grid layout on desktop
- [x] Single column stacking on mobile
- [x] Column reversal via isReversed
- [x] Row reversal via reverseRows
- [x] Dark mode card pseudo-elements with rounded corners
- [x] Content vertically centered within content column

**Typography**
- [x] Heading uses Anton font at correct sizes (text-header-2 / text-header-3)
- [x] Body text uses General Sans at 16px with 1.5 line-height
- [x] Topic tag pill and eyebrow text at 14px uppercase medium weight

**Colors**
- [x] Topic tag pill accent-lighter background and accent border
- [x] Dark mode text switches to white
- [x] Dark mode button inverts to white background with charcoal text
- [x] Topic tag pill maintains accent colors in dark mode with explicit charcoal text

**Components**
- [x] Button follows btn-primary styling (rounded-full, uppercase)
- [x] Image container with 4:3 aspect ratio
- [x] Image uses default-mask CSS class for rounded shape

**Spacing (after fixes)**
- [x] 24px gap between topic tag row and heading
- [x] 32px (mobile) / 48px (desktop) gap between heading and description
- [x] 32px (mobile) / 48px (desktop) gap between description and button

---

## Changelog

| Timestamp | Change |
|-----------|--------|
| 2026-02-10 12:36 PST | Planning complete: spec with 14 decisions, 0 ambiguities. Clone ContentWithMedia pattern with PostSelectorSortable, dynamic post data, topic tag pill, image-only media. |
| 2026-02-10 12:43 PST | Initial implementation: 5 files created (block.json, index.tsx, FeaturedPost.tsx, FeaturedPost.php, FeaturedPost.svg). Build passes. Test page created with 8 block instances covering all variations. |
| 2026-02-10 14:02 PST | Functional QA: 8 checks run, 6 passed, 2 failed. 3 issues found: FQA-001 (major) pill text contrast in dark mode, FQA-002 (major) image alt text TSX/PHP mismatch, FQA-003 (minor) eyebrow text color inheritance. |
| 2026-02-10 14:04 PST | Design QA: Composition matches Figma well. 3 major spacing issues found: DQA-001 zero gap between description and button, DQA-002 topic-to-heading gap 16px vs 24px, DQA-003 heading-to-description gap 32px vs 48px. 4 informational notes (all within tolerance). |
| 2026-02-10 14:14 PST | Developer fixes applied: All 5 actionable issues resolved (FQA-001, FQA-002, DQA-001, DQA-002, DQA-003). FQA-003 accepted as-is (no fix needed). Build passes. TSX/PHP sync verified. |
| 2026-02-10 14:16 PST | Final report generated. Block is production-ready. |
| 2026-02-13 14:49 PST | Edit cycle initiated: accessibility review, test page update, and code quality fixes. |
| 2026-02-13 14:52 PST | Planning: Identified 5 bugs: FP-001 (image alt fallback), FP-002 (CTA aria-label), FP-003 (TSX/PHP sync), FP-004 (excerpt escaping), FP-005 (test page format). Test page restructured from 8 to 10 DemoContainer-wrapped variations. |
| 2026-02-13 14:55 PST | Developer: Applied accessibility fixes (image alt text now decorative, added aria-label to CTA, changed excerpt to wp_kses_post). Synced TSX/PHP. Updated test page with 10 variations in DemoContainer wrappers using self-closing block markup. Build passes. |
| 2026-02-13 14:58 PST | Functional QA: 3 issues found (FQA-001 manual attribute extraction, FQA-002 missing @var docblock, FQA-003 unused variable in TSX). All accessibility fixes verified correct. |
| 2026-02-13 15:08 PST | Design QA: PASS. Full visual validation across all 4 Figma variants and 10 test page variations. Composition, typography, colors, spacing, layout all match at all breakpoints (375px, 768px, 1024px, 1440px) across all browsers (Chromium, Firefox, WebKit). 3 notes within tolerance. |
| 2026-02-13 15:13 PST | Developer: Applied FQA fixes (removed manual attribute extraction in PHP, added @var docblock for auto-extracted variables, removed unused postPermalink in TSX). All 3 major/minor issues resolved. Build passes. TSX/PHP sync maintained. |
| 2026-02-13 15:15 PST | Functional QA recheck: PASS. All 3 issues resolved. 10 test page variations verified. No new issues. Build passes. Production ready. |
| 2026-02-13 15:13 PST | Report updated: accessibility improvements documented, test page variations (10 DemoContainer-wrapped), all issues resolved, screenshots verified. |
| 2026-02-13 15:23 PST | Revision 1 - User review requested. Three concerns: alt text approach, CSS dependencies, inline mask styles. Planning: Confirmed only alt text revert needed. CSS audit verified zero cross-block dependencies. Mask styles confirmed in PostHero, not FeaturedPost. |
| 2026-02-13 15:28 PST | Revision 1 - Developer: Removed manual alt text override from PHP. `wp_get_attachment_image()` now handles alt text natively from media library. Removed 2 lines of redundant code. Build passes. TSX/PHP sync maintained. No functional changes. |
| 2026-02-13 15:30 PST | Revision 1 - Functional QA: PASS. Alt text verified from media library across all 10 test variations. All images render correctly. No regressions. Code quality improved by eliminating redundant manual alt lookup. Block remains production-ready. |
| 2026-02-13 15:32 PST | Revision 2 - Code quality improvement: Fixed incorrect `theme_block_props()` usage in PHP. Removed redundant `class_name()` wrapper around conditional array. The helper already calls `class_name()` internally. Corrected pattern: pass conditional arrays directly to `theme_block_props()`. Build passes. Block remains production-ready. |
| 2026-02-18 PST | Replaced conditional `rounded-3xl`/`rounded-xl` border-radius classes with `default-mask` CSS class on the image media container. The `default-mask` class uses a CSS mask for the rounded shape. Applied to both TSX and PHP. |
| 2026-02-23 PST | Updated block.json example: viewportWidth 1400→1440 to match standard section preview width. |
| 2026-03-09 PST | Dark mode refactor: Removed per-column `before:` pseudo-element dark backgrounds from content and media columns. Added single container-level pseudo (`relative py-18 md:py-23 before:absolute before:bg-dark-pattern before:rounded-3xl before:-z-1 before:-inset-x-(--side-gutter) before:inset-y-0 md:before:-inset-x-8`). Section padding (`py-10 sm:py-16`) now conditional on light mode. Both TSX and PHP updated. |
| 2026-03-09 PST | BH #80 #77 #74 #64 #62 #61 #47 #44 #35 #33 #32 #29 #27 #22 #17 #16 #15 #13 #12 #10: ThemeHeading spacing fixes. Heading-to-description spacing increased to 48px (`not-group-last:mb-12`), description-to-buttons spacing set to 32px (`not-last:mb-8`). Added `theme-heading` class to wrapper for tertiary button padding scoping. Tertiary buttons inside ThemeHeading now have `padding-top/bottom: calc(1rem + 1px)` to match primary/secondary touch area. |
| 2026-03-09 PST | Button row gap changed from `gap-4` to `gap-x-4 gap-y-2` (8px row-gap) on ThemeHeading buttons wrapper and ButtonRow block (PHP + TSX). |
