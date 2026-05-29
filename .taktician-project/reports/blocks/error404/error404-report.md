# Error 404 Block Report

**Date:** 2026-02-17 11:42 PST

**Test Page:** https://ign.localhost/test-error404/

**Figma Source:** No design available (block type sourced from specification)

---

## Requirements

### User Requirements
- [ ] Displays an error message for 404 pages with heading, description, and CTA buttons
- [ ] Heading field for displaying "404" or custom message
- [ ] Optional description text explaining the error
- [ ] Up to 3 configurable CTA buttons (primary, secondary, tertiary variations)
- [ ] Buttons render only when URL or post ID is configured
- [ ] Single block instance per page (multiple: false)

### Block Type Requirements
- [ ] Semantic heading structure with h1 tag
- [ ] Accessibility landmark identification via theme_block_region_id()
- [ ] Inline-editable content using AdvancedRichText
- [ ] Dynamic button rendering with ThemeButton component
- [ ] Conditional empty state handling (text group and button group)
- [ ] Responsive centered layout working at all breakpoints
- [ ] Typography scale alignment (text-header-0 for heading, text-body-large for description)

---

## Block Behavior

The Error 404 block provides a centered, full-width error page layout for 404 responses. The block begins with a large heading (typically "404") rendered in the site's largest heading typography, followed by an optional explanatory description below it. Below the text sits a centered group of up to 3 configurable buttons for user navigation.

**Text Group:** The heading always appears when content is added. The description text is optional and only displays when text is provided. When the block is empty, only the space for the heading is reserved until content is added. The editor provides inline editing for both fields without format options (plain text only).

**Button Group:** Buttons render conditionally based on configuration. Only buttons with a URL or linked post ID will appear on the page. Buttons without URLs remain hidden, allowing editors to configure 3 button slots and leave unused ones empty. This supports flexibility in how many CTAs appear (0, 1, 2, or 3). Each button can be styled as primary, secondary, or tertiary variation, matching the site's button design system.

**Responsive Behavior:** The entire layout uses a single-column, centered design that works identically across mobile, tablet, and desktop viewports. The heading text scales appropriately using the theme's responsive typography utility, with larger sizes on desktop and smaller sizes on mobile. No layout restructuring occurs at different screen sizes — the design is inherently mobile-first centered. Buttons wrap to multiple lines when needed at smaller viewports.

**Block Instance:** Only one Error 404 block can be added per page, enforced at the block registration level. This prevents duplicate error messages on the same page.

---

## Development Notes

**Typography Adaptation (DEC-001):** The block type specification references `text-display` utility which does not exist in this theme. Instead, `text-header-0` was used as the largest available heading utility (4rem on mobile, 5.25rem on desktop) with Anton font family. This provides the visual weight expected for a 404 heading.

**Spacing Variable Naming (DEC-002):** The block uses `mt-(--header-height)` for the top margin offset below the fixed header. The site defines this variable in `body.css`; no `--header-main-height` variant exists.

**Font Weight Removal (DEC-003):** The block type specification included `font-bold` on the heading. The theme's Anton font headings are configured with `font-weight: 400` per typography.css, and `text-header-0` utility already applies the correct weight. Adding `font-bold` would conflict with the theme's base heading styles, so it was omitted.

**Editor Empty State:** The block uses `shouldDisplay()` utility to control conditional rendering in the editor, mirroring the frontend PHP logic. This ensures what editors see matches what renders on the page.

---

## Issues to Address

**Severity: Note (informational, not a defect)**

| Issue | Severity | Description | Suggested Fix |
|-------|----------|-------------|----------------|
| FQA-NOTE-001 | note | Test page button hrefs use '#' placeholder URLs. In production 404 deployment, buttons should link to actual URLs (homepage, contact page, etc). | Configure button URLs in the actual 404 template to point to real page destinations. Test page behavior is expected and correct. |

---

## Test Results

### Validation Summary

| Check | Status | Notes |
|-------|--------|-------|
| Build | PASS | Compiles without errors. Error404 files are lint-clean. |
| Block Registration | PASS | `block.json` valid: apiVersion 3, name `takt/error404`, category `takt-theme-template`, `multiple: false`, all attributes defined correctly |
| Attributes | PASS | All 4 attributes (anchor, heading, description, buttons) correctly typed with appropriate defaults |
| Responsive Layout | PASS | Single-column centered design works at 375px, 768px, 1024px, 1440px with no overflow |
| TSX/PHP Sync | PASS | Editor (TSX) and frontend (PHP) produce identical HTML structure. All conditional logic mirrors perfectly. |
| Accessibility | PASS | Semantic h1 heading, proper landmark identification via `theme_block_region_id()`, `aria-labelledby` on section, links use proper semantic elements |
| Empty States | PASS | Heading-only variant renders correctly. Buttons with empty URLs suppress button group. No errors in minimal configurations. |
| Edge Cases | PASS | 500+ character description and extended heading render without truncation or overflow at any viewport |
| Spec Compliance | PASS | 6 test page instances verified inside demo containers, no stale markup, no placeholder artifacts |

### Screenshots

**Mobile (375px)**
![Mobile](screenshots/2026-02-17-113942/error404-chromium-375w.png)

**Tablet (768px)**
![Tablet](screenshots/2026-02-17-113942/error404-chromium-768w.png)

**Desktop (1024px)**
![Desktop Sm](screenshots/2026-02-17-113942/error404-chromium-1024w.png)

**Desktop (1440px)**
![Desktop Lg](screenshots/2026-02-17-113942/error404-chromium-1440w.png)

### Test Cases

| Variation | Description | Expected | Result |
|-----------|-------------|----------|--------|
| Default - Minimal Content | Heading only ("404"), no description, no buttons | h1 renders, description absent, button group absent | PASS |
| Full Content - All Fields Populated | Heading, full description, 3 active buttons (primary/secondary/tertiary) | All elements render, 3 links present | PASS |
| Long Content - Edge Case | Excessive text (500+ chars in description, extended heading) | No truncation, no overflow at any viewport | PASS |
| Single Button Only | Heading, description, only primary button active (secondary/tertiary empty) | 1 link renders, empty URL buttons suppressed | PASS |
| No Buttons - Text Only | Heading, description, all button slots empty | Button group absent, text renders | PASS |
| Heading Only - Minimal | Only heading ("404"), description empty, no buttons | Only h1 renders, minimal display | PASS |

### What Matched

- **Layout:** Single-column centered design with generous vertical padding (pt-20 pb-40)
- **Typography:** Heading uses text-header-0 with Anton font, description uses text-body-large
- **Components:** Buttons use ThemeButton component for consistent site styling
- **Spacing:** Container uses gap-12, text group uses gap-6, button group uses gap-4
- **Accessibility:** Semantic heading (h1), proper section identification, no ARIA violations

### Excluded Checks

None — all applicable checks completed for this block type (static-content 404 page).

---

## Changelog

| Timestamp | Change |
|-----------|--------|
| 2026-02-17 11:16 PST | Initial block planning complete. 6 test variations defined. Decisions: use text-header-0 (largest available heading), text-accent (theme accent color), mt-(--header-height) (correct CSS variable), removed font-bold (conflicts with theme typography). |
| 2026-02-17 11:36 PST | Block implementation complete. All 5 files created: block.json, index.tsx, Error404.tsx, Error404.php, Error404.svg. Build passing, lint clean for Error404 code. Test page created with 6 verified block instances. |
| 2026-02-17 11:37 PST | Functional QA complete. 11/11 checks passed. Block renders correctly at all breakpoints, empty states work properly, button filtering functions correctly, TSX/PHP sync verified. 1 note: test page uses placeholder URLs (expected). No issues requiring fixes. |
| 2026-02-17 11:42 PST | User revision: removed text-accent color class from heading. Heading now uses only text-header-0 typography without color styling. QA re-verified: PASS. |
| 2026-02-18 PST | Tertiary button arrow style update (affects tertiary button variant option): Arrow now animates 12px right on hover/focus via margin transition (pre-reserved with `margin-right: 0.75rem`, transitions to `margin-left: 0.75rem; margin-right: 0`). Hover underline removed. Arrow wrapper class changed to `btn-tertiary-arrow` CSS class. Animation handled globally in `resources/css/screen/button.css`. |
| 2026-02-23 PST | Updated block.json example: viewportWidth 1400→1440 to match standard section preview width. |

---

## Summary

The Error 404 block is a static, full-width error page template block with no interactive elements. It provides a clean, accessible way to display custom 404 messages with configurable heading, description, and CTA buttons. The implementation adapts design specifications to the site's typography and color system, uses semantic HTML with proper accessibility landmarks, and maintains complete parity between editor (TSX) and frontend (PHP) renderings.

**Test Status:** All 11 functional checks passed. Build and lint clean. Responsive layout verified across 4 breakpoints. 1 informational note about placeholder button URLs (expected test page behavior).

**Production Readiness:** Block is ready for deployment. Assign to actual 404 page template with real button URLs configured.
