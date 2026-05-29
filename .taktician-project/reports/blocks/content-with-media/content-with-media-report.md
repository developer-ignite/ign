# Block Report: Content With Media

**Date:** 2026-02-18 14:56 PST
**Test Page:** [https://ign.localhost/test-content-with-media/](https://ign.localhost/test-content-with-media/)
**Figma Source:** Not available

## Requirements

### User Requirements

Core features and InnerBlocks architecture:

- [x] Two-column layout with content on one side and media on the other
- [x] Content area replaced with InnerBlocks supporting core/paragraph, core/list, core/quote, core/separator, takt/button-row
- [x] No headings allowed in InnerBlocks (ThemeHeading handles heading structure)
- [x] Default InnerBlocks template includes one paragraph and one button-row with primary button
- [x] InnerBlocks wrapper uses 'discourse' class for proper prose typography
- [x] ThemeHeading only renders eyebrow and heading (enableDescription=false, enableButtons=false)
- [x] Deprecation/migration handler converts existing description and buttons attributes to InnerBlocks
- [x] Heading size attribute support (small=H3, regular=H2)
- [x] Gallery layout with 3-image collage rendering or single image layout
- [x] Video support: file upload, YouTube, Vimeo embeds with optional poster images
- [x] Dark mode variant with charcoal background
- [x] Layout reversal (media left/right toggle)
- [x] Mobile row reversal (content/media stacking order)
- [x] Focal point picker for image positioning

### Block Type Requirements

No block type requirements documented.

## Block Behavior

### Layout
- Two columns side by side on desktop with content on one side and media on the other
- Stacks to single column on mobile
- Media position can be reversed using the layout toggle (media left or right)
- Mobile column stacking order can be reversed independently (content-first or media-first)

### Content Structure
- **Eyebrow and Heading:** Optional eyebrow text above main heading; heading size is configurable (regular renders as H2, small renders as H3)
- **Inner Content:** Flexible InnerBlocks area supporting multiple content types:
  - Paragraphs with rich text formatting
  - Lists (ordered or unordered)
  - Block quotes
  - Horizontal separators
  - Button rows with one or more buttons
- Editors can add, remove, and reorder content blocks freely
- Headings are not allowed in InnerBlocks (ThemeHeading handles heading hierarchy)

### Media Types
- **Images:** Gallery layout (3-image collage) or single image layout with 4:3 aspect ratio
- **Videos:** File upload, YouTube, or Vimeo embeds
- Optional poster image for videos (if provided, shows poster with play button overlay)
- If no poster image provided for YouTube/Vimeo, iframes render directly without overlay

### Interactive Features
- Play button overlay on videos with poster images triggers video playback
- Buttons show focus outlines for keyboard navigation
- Focus and hover states visible to all users

### Dark Mode
- Applies charcoal pseudo-element background with white text
- Background extends beyond content area for visual impact
- Content color inverted to white text in dark mode

### Accessibility
- All interactive elements have accessible names
- Video iframes have descriptive title attributes
- Decorative SVG icons marked as hidden from screen readers
- Section labeled via aria-labelledby
- Proper heading hierarchy maintained through ThemeHeading
- Images use alt text from WordPress media library

## Development Notes

### InnerBlocks Architecture
The block was refactored to replace the `description` RichText attribute and `buttons` array with a flexible InnerBlocks system:

- **ThemeHeading Role:** Now handles only eyebrow and heading rendering (with `enableDescription=false` and `enableButtons=false` flags)
- **InnerBlocks Content:** Replaces description and buttons with a managed content area supporting paragraph, list, quote, separator, and button-row blocks
- **Allowed Blocks:** Core/heading is explicitly excluded since ThemeHeading manages heading hierarchy
- **Wrapper Class:** InnerBlocks content wrapped with 'discourse' class to provide proper prose typography for paragraphs, lists, and quotes
- **Default Template:** New blocks start with a paragraph placeholder and button-row containing one primary button
- **Layout:** Content column changed from `flex items-center` to `flex flex-col justify-center gap-8` to properly stack heading and InnerBlocks content with consistent spacing

### Deprecation and Migration
Two complementary strategies handle the transition from attribute-based description/buttons to InnerBlocks:

- **Editor-side (automatic):** A `deprecated` handler in `index.tsx` auto-converts old attribute shapes to InnerBlocks when a block is opened in the editor. Old `description` string becomes a `core/paragraph` block; old `buttons` array becomes a `takt/button-row` with `takt/button` children. This is transparent to editors.
- **Server-side (one-off script):** A migration script at `scripts/migrate-content-with-media.js` (with PHP helper at `scripts/migrate-content-with-media.php`) converts existing database content directly, so blocks render correctly on the frontend without needing to be re-saved in the editor. Supports `--dry-run` (default) and `--apply` flag. Executed on page 168: 13 blocks migrated successfully, 2 skipped (heading-only blocks with no description or buttons content to migrate).
- **PHP template:** Reverted to simple hardcoded `enableDescription => false, enableButtons => false` -- no permanent runtime fallback needed since the migration script handles existing content.

### Dark Mode Background Texture Utility
A `@utility bg-dark-pattern` was introduced to combine the charcoal background color with the dark texture background image. This utility is applied to the pseudo-element `:before` in the dark mode variant, eliminating the need to specify both `bg-charcoal` and `background-image` separately. The `.dark` class no longer includes the texture image — only blocks explicitly using the `bg-dark-pattern` utility (via the block's `darkMode` attribute) render with the textured background.

### Trade-offs and Deviations

- InnerBlocks excludes headings to prevent hierarchy conflicts (ThemeHeading handles all heading structure)
- Alt text relies on WordPress media library entries to encourage proper editorial practice
- prefers-reduced-motion handled globally via theme CSS

## Issues to Address

**No outstanding issues.** All QA checks passed after one fix cycle.

## Test Results

### Validation Summary

| Property | Value |
|----------|-------|
| **Overall Status** | PASS |
| **Last Test Type** | Full (InnerBlocks implementation) |
| **QA Cycle** | 1 fix cycle (FQA → Developer Fix → FQA re-verify) |
| **Test Page Variations** | 5 new InnerBlocks scenarios (page 184) + 15 migrated legacy scenarios (page 168) |
| **Build Status** | PASS |
| **Lint Status** | PASS (ContentWithMedia block-specific) |
| **Browsers Tested** | Chromium (via screenshots) |
| **Breakpoints Tested** | 375px, 768px, 1024px, 1440px |

### Screenshots

#### Full Validation (Chromium, All Breakpoints)

| Breakpoint | Screenshot |
|------------|-----------|
| 375px | [view](screenshots/content-with-media-375w.png) |
| 768px | [view](screenshots/content-with-media-768w.png) |
| 1024px | [view](screenshots/content-with-media-1024w.png) |
| 1440px | [view](screenshots/content-with-media-1440w.png) |

### Test Cases

#### New InnerBlocks Test Page (ID 184) -- 5 scenarios

| Test Case | Status | Notes |
|-----------|--------|-------|
| Image Gallery - Full Content | PASS | Gallery layout with eyebrow, heading, paragraph, and button-row block |
| Image Gallery - Reversed | PASS | isReversed=true, media on right side, gallery collage with paragraph and button |
| Single Image - Dark Mode | PASS | Single image layout with dark mode background, heading size=small, paragraph, list, and button |
| Video - YouTube Embed | PASS | Video content with YouTube embed and poster image, paragraph, quote, and 2 buttons |
| Minimal Content | PASS | Block with only heading and single paragraph (no buttons, no eyebrow) |

#### Migrated Legacy Test Page (ID 168) -- 15 scenarios

| Test Case | Status | Notes |
|-----------|--------|-------|
| Full Content - Gallery Layout (Default) | PASS | Migrated: description converted to paragraph, buttons converted to button-row |
| Reversed Layout - Gallery | PASS | Migrated: InnerBlocks render correctly in reversed column |
| Single Image Layout | PASS | Migrated: single image with paragraph and buttons |
| Dark Mode - Gallery | PASS | Migrated: dark mode styling applies to InnerBlocks content |
| Dark Mode - Reversed | PASS | Migrated: dark mode + reversed layout combination |
| Video - File Upload with Poster | PASS | Migrated: video with poster image overlay |
| Video - YouTube Embed | PASS | Migrated: YouTube iframe injection on play |
| Video - Vimeo Embed | PASS | Migrated: Vimeo iframe injection on play |
| Video - YouTube Without Poster | PASS | Migrated: direct iframe rendering |
| Reverse Rows (Mobile Order) | PASS | Migrated: mobile stacking order |
| Minimal Content - Heading Only | PASS | Skipped by migration (no description/buttons to convert) |
| Long Content Edge Case | PASS | Migrated: long text wrapping in paragraph block |
| Dark Mode - Video with Poster | PASS | Migrated: dark mode + video combination |
| Dark Mode - Single Image | PASS | Migrated: dark mode + single image layout |
| Heading Size - Small (H3) | PASS | Skipped by migration (heading-only, no content to convert) |

### What Matched

**InnerBlocks Implementation**
- [x] InnerBlocks render correctly in editor below eyebrow/heading
- [x] Core/paragraph can be added and edited
- [x] Core/list can be added and edited
- [x] Core/quote can be added and edited
- [x] Core/separator can be added and edited
- [x] takt/button-row can be added with takt/button children
- [x] Core/heading correctly excluded from allowed blocks
- [x] Default template loads with paragraph + button-row on new insertion
- [x] Discourse wrapper class applied for prose typography
- [x] InnerBlocks content renders correctly on frontend

**Layout and Styling**
- [x] Gallery layout (3-image collage) rendering correctly
- [x] Single image layout with 4:3 aspect ratio
- [x] Dark mode styling applied to InnerBlocks content
- [x] isReversed layout works with InnerBlocks
- [x] reverseRows (mobile ordering) works with InnerBlocks
- [x] Media column renders correctly alongside InnerBlocks
- [x] Heading size toggle (regular=H2, small=H3) working correctly

**Deprecation and Migration**
- [x] Editor-side deprecated handler exists in index.tsx (auto-converts on block open)
- [x] Server-side migration script converts database content directly
- [x] Old description attribute converts to core/paragraph block
- [x] Old buttons array converts to takt/button-row with children
- [x] Migration executed on page 168: 13 blocks migrated, 2 skipped (no content)
- [x] All 15 migrated blocks render correctly on frontend

**Accessibility**
- [x] Play button has aria-label="Play video"
- [x] Video iframes have descriptive title attributes
- [x] SVG icons properly hidden from screen readers (aria-hidden)
- [x] Section has aria-labelledby pointing to heading
- [x] Heading hierarchy maintained (H2/H3 based on headingSize)
- [x] Focus outlines visible on interactive elements
- [x] All 5 new test page instances render correctly
- [x] All 15 migrated legacy instances render correctly

**Build & Lint**
- [x] Build passes (only pre-existing performance warnings)
- [x] Lint passes for ContentWithMedia block
- [x] TSX and PHP perfectly synchronized
- [x] No $attributes['key'] manual extraction in PHP
- [x] @var docblock present for camelCase variables
- [x] No new regressions introduced

### Excluded Checks

None.

## Changelog

| Timestamp | Change |
|-----------|--------|
| 2026-02-12 20:44 PST | Context analysis started (block audit begins) |
| 2026-02-12 20:47 PST | Planning complete: Identified 6 accessibility gaps and 14 test scenarios needed |
| 2026-02-12 20:50 PST | Developer implementation: Added accessibility fixes (aria-label, iframe titles, aria-hidden), created test page with 14 scenarios |
| 2026-02-12 20:55 PST | Functional QA: 5 checks run, 4 issues found (BaseControl id, PHP docblock, computed vars, camelCase documentation) |
| 2026-02-12 20:59 PST | Developer fixes applied: Added id to BaseControl, comprehensive PHP @var docblock, separated computed helpers |
| 2026-02-12 21:01 PST | Functional QA re-verification: All 5 checks PASS, 0 issues remaining |
| 2026-02-12 21:03 PST | Report generated: Block ready for production |
| 2026-02-12 22:09 PST | headingSize attribute implemented: Added `headingSize` to block.json, ToggleGroupControl in editor sidebar, maps regular to H2 and small to H3. Test page updated to 15 scenarios. |
| 2026-02-13 11:38 PST | InnerBlocks refactor: Replaced `description` RichText and `buttons` array attributes with flexible InnerBlocks. ThemeHeading now only handles eyebrow and heading (enableDescription=false, enableButtons=false). InnerBlocks allows core/paragraph, core/list, core/quote, core/separator, takt/button-row (no headings). Default template: paragraph + button-row with primary button. Added discourse class wrapper. Added deprecation/migration handler to convert existing blocks. Test page updated to 5 variations covering all new InnerBlocks scenarios. All 11 Functional QA checks passed. |
| 2026-02-13 12:00 PST | Migration fix: Replaced permanent PHP legacy fallback with one-off migration script (`scripts/migrate-content-with-media.js` + `scripts/migrate-content-with-media.php`). Script converts self-closing blocks with old `description`/`buttons` attributes to InnerBlocks format in the database. Executed on page 168: 13 blocks migrated, 2 skipped (heading-only with no content to convert). PHP template reverted to simple hardcoded `enableDescription => false, enableButtons => false`. Both test pages verified: page 184 (5 new blocks) and page 168 (15 migrated blocks) all PASS. Note: Files Modified section removed as it duplicated information. |
| 2026-02-17 21:01 PST | Editor UI refinement: Removed "(H2)" and "(H3)" suffix labels from heading size toggle options. Changed "Regular (H2)" to "Regular" and "Small (H3)" to "Small" for cleaner editor UI. TSX-only change, no PHP or frontend impact. All 5 test instances verified. |
| 2026-02-18 PST | Replaced conditional `rounded-3xl`/`rounded-xl` border-radius classes with `default-mask` CSS class on all media containers (single image, gallery images, video container). The `default-mask` class uses a CSS mask for the rounded shape. Applied to both TSX and PHP. |
| 2026-02-18 14:56 PST | Dark mode background texture utility: Created `@utility bg-dark-pattern` in colors.css combining charcoal background-color with dark texture image. Removed `.dark` from combined background-image rule — only `bg-dark-pattern` applies the texture. Updated dark mode classes in TSX and PHP to use `before:bg-dark-pattern` instead of `before:bg-charcoal`. Build and sync verification PASS. |
| 2026-02-23 PST | Updated block.json example: viewportWidth 1400→1440, replaced repeated picsum image URLs with unique images (684, 704, 702 for gallery, 667 for posterImage). Updated URL format to picsum.photos/id/{id}/{w}/{h}. |
| 2026-03-09 PST | Dark mode refactor: Removed per-column `before:` pseudo-element dark backgrounds from content and media columns. Added single container-level pseudo (`relative py-18 md:py-23 before:absolute before:bg-dark-pattern before:rounded-3xl before:-z-1 before:-inset-x-(--side-gutter) before:inset-y-0 md:before:-inset-x-8`). Section padding (`py-10 sm:py-16`) now conditional on light mode. Fixed TSX `bg-transparent` to `bg-transparent!` to match PHP. Both TSX and PHP updated. |
| 2026-03-09 PST | BH #80 #77 #74 #64 #62 #61 #47 #44 #35 #33 #32 #29 #27 #22 #17 #16 #15 #13 #12 #10: Increased heading-to-content gap from 32px (`gap-8`) to 48px (`gap-12`) on content column flex container (PHP + TSX). Added 32px spacing before button-row inside discourse area: PHP uses `[&>.button-row]:mt-8` (direct child, margin collapse with paragraph's mb-6 → 32px), TSX uses `[&_.button-row]:mt-8` (descendant selector to reach through editor wrappers, same margin collapse logic). |
| 2026-03-09 PST | Button row gap changed from `gap-4` to `gap-x-4 gap-y-2` (8px row-gap) on ThemeHeading buttons wrapper and ButtonRow block (PHP + TSX). |
