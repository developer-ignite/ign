# Block Report: Call to Action

**Date:** 2026-02-12 22:51 PST
**Test Page:** https://ign.localhost/test-call-to-action/ (ID: 42)
**Figma Source:** No Figma reference available

## Requirements

### User Requirements

- [ ] Support solid color and image backgrounds
- [ ] Background image supports focal point positioning
- [ ] Eyebrow text above heading (hidden when empty)
- [ ] Heading text field
- [ ] Description text field
- [ ] Support up to 2 buttons with variations (primary, secondary)
- [ ] Responsive layout: two-column on desktop, single column on mobile
- [ ] Dark mode gradient overlay for readability over images
- [ ] Accessibility compliance: background images marked as decorative
- [ ] Proper semantic HTML with aria-labelledby when heading exists

### Block Type Requirements

No block type requirements documented.

## Block Behavior

**User-facing description of the Call to Action block.**

### Layout and Content

- Section-based container with heading, description, and buttons
- Two background options: solid color (default) or image
- Eyebrow text above the heading (optional, hidden when empty)
- Main heading for section title (optional)
- Body text for description (optional)
- Up to 2 buttons at the bottom with primary or secondary styling
- Max-width constraint (max-w-2xl) for readability

### Background Variants

**Color Background:**
- Solid accent color background
- Suitable for text-heavy content

**Image Background:**
- Full-bleed background image with dark gradient overlay
- Ensures text readability over varied image content
- Supports focal point positioning to control which part of the image is visible

### Responsive Behavior

- Desktop: Full layout with heading, description, and horizontally-arranged buttons
- Tablet (768px and up): Same as desktop
- Mobile (below 768px): All elements stack vertically, buttons arrange in single column when space-constrained
- Long content handling: Text wraps within max-w-2xl container without overflow

### Conditional Rendering

- Eyebrow hidden when empty
- Description hidden when empty
- Buttons hidden when empty
- aria-labelledby only applied when heading exists
- Background image only rendered when backgroundType is "image"

### Image Handling

- Background image can be repositioned using focal point values (x: 0-1, y: 0-1)
- Image is marked as decorative (alt="" and aria-hidden="true") since it sits behind text overlay
- Gradient overlay (rgba background) ensures sufficient contrast for text

## Development Notes

### Design Decisions

**Background Image as Decorative:** The background image is intentionally marked as decorative with `alt=""` and `aria-hidden="true"` because it serves as a visual backdrop behind gradient overlays and text content. Screen readers should not announce it, as it doesn't convey meaningful information independently. The text content is the primary message.

**Focal Point Implementation:** Uses 0-1 range values (not percentages) for focal point positioning to match WordPress media library format. This ensures consistency with other WordPress blocks and the core image handling patterns.

**Gradient Overlay for Dark Mode:** The image background variant uses a semi-transparent dark gradient (rgba(31,31,29,0.5) to rgba(31,31,29,0.2)) to ensure text readability over varied background images. This allows the block to work with both light and dark images without requiring editor configuration.

### Color Mapping

- `bg-accent` → Background color for color variant (theme token)
- `dark` class → Applied with gradient overlay for image variant
- Text color: White for sufficient contrast over dark gradient

### Trade-offs

- Fixed color background vs. flexible image backgrounds: The color variant uses a consistent theme token, while image backgrounds require editor-provided images. Both approaches provide clear visual hierarchy and readability.

### Deviations from Design

None documented. Implementation follows standard WordPress block patterns and accessibility guidelines.

## Issues to Address

### 1. Missing PHP Docblock

**Severity:** Minor
**Description:** The CallToAction.php file is missing a `@var` docblock at the top that documents the camelCase variables extracted from block attributes. This causes PHP_CodeSniffer to generate warnings about non-standard variable naming conventions.

**Suggested Fix:** Add the following docblock before the opening `<?php` tag:

```php
<?php
/**
 * Call to Action block frontend template.
 *
 * Available variables (auto-extracted from $attributes):
 * @var string $anchor
 * @var string $backgroundType
 * @var array $image
 * @var string $eyebrow
 * @var string $heading
 * @var string $description
 * @var array $buttons
 *
 * Also available:
 * @var string $children Inner blocks content (not used)
 * @var WP_Block $block Block instance
 */
?>
```

This documents that the camelCase variables are intentionally extracted from block attributes (which use camelCase from JavaScript) and should not trigger coding standards warnings.

## Test Results

### Validation Summary

| Property | Value |
|----------|-------|
| **Last Test Type** | Full |
| **Overall Status** | PASS |
| **Breakpoints Tested** | 375px, 768px, 1024px, 1440px |
| **Browsers Tested** | Chromium, Firefox, WebKit |
| **Variations Tested** | Color background (full/minimal content), Image background (full/minimal/custom focal point), Long content edge cases, Single button, No heading |
| **Production Ready** | Yes |

### Screenshots

All breakpoints captured with multiple browsers.

#### Desktop (1440px)

| Browser | Screenshot |
|---------|-----------|
| Chromium | [view](screenshots/call-to-action-chromium-1440w.png) |
| Firefox | [view](screenshots/call-to-action-firefox-1440w.png) |
| WebKit | [view](screenshots/call-to-action-webkit-1440w.png) |

#### Tablet (1024px)

| Browser | Screenshot |
|---------|-----------|
| Chromium | [view](screenshots/call-to-action-chromium-1024w.png) |
| Firefox | [view](screenshots/call-to-action-firefox-1024w.png) |
| WebKit | [view](screenshots/call-to-action-webkit-1024w.png) |

#### Tablet (768px)

| Browser | Screenshot |
|---------|-----------|
| Chromium | [view](screenshots/call-to-action-chromium-768w.png) |
| Firefox | [view](screenshots/call-to-action-firefox-768w.png) |
| WebKit | [view](screenshots/call-to-action-webkit-768w.png) |

#### Mobile (375px)

| Browser | Screenshot |
|---------|-----------|
| Chromium | [view](screenshots/call-to-action-chromium-375w.png) |
| Firefox | [view](screenshots/call-to-action-firefox-375w.png) |
| WebKit | [view](screenshots/call-to-action-webkit-375w.png) |

#### Accessibility Verification

| Details |
|---------|
| [Aria-hidden verification](screenshots/aria-hidden-verification-1440w.png) |

### Test Cases

| Test Case | Status | Notes |
|-----------|--------|-------|
| Color Background - Full Content | PASS | All fields render: eyebrow, heading, description, 2 buttons (primary + secondary). bg-accent class applied. |
| Image Background - Full Content | PASS | All fields render with image background. Dark mode with gradient overlay applied. Background image properly marked as decorative (alt='', aria-hidden='true'). 2 buttons render correctly. |
| Color Background - Minimal Content | PASS | Only heading renders. Empty eyebrow, description, and buttons properly hidden. No empty containers. |
| Image Background - Minimal Content | PASS | Heading and image background only. Empty fields hidden. Dark mode with gradient applied correctly. |
| Long Content Edge Case | PASS | Very long heading (166+ chars), long eyebrow, long description, and buttons with long titles all wrap correctly within max-w-2xl constraint. No overflow issues. |
| Long Content - Image Background | PASS | Long content with image background. Text readability maintained over image with gradient overlay. Layout remains stable with taller content. |
| Empty Optional Fields | PASS | Heading only. All optional fields empty and properly hidden. ThemeHeading conditional rendering works correctly. |
| Single Button | PASS | Single primary button renders correctly. Button container layout works with one item. Responsive stacking works on mobile. |
| Image Background - Custom Focal Point | PASS | Focal point (x: 0.5, y: 0.2) correctly applies object-position CSS. Image focuses on top portion as expected. |
| No Heading - Description and Buttons Only | PASS | Description and 2 buttons render without heading. aria-labelledby correctly omitted (no heading to reference). Graceful handling of edge case. |

### What Matched

**Accessibility:**
- [x] Semantic HTML with proper `<section>` elements
- [x] Heading hierarchy correct (h2 elements)
- [x] aria-labelledby applied when heading exists, omitted when absent
- [x] Background images marked as decorative (alt="", aria-hidden="true")
- [x] Buttons are proper `<a>` elements with accessible labels
- [x] Gradient overlay provides sufficient contrast over images
- [x] No keyboard navigation issues

**Functionality:**
- [x] Color background variant works with bg-accent class
- [x] Image background variant applies dark mode with gradient overlay
- [x] Focal point positioning works (object-position CSS applied)
- [x] Eyebrow, heading, description conditionally render (empty fields hidden)
- [x] Buttons render with correct variations (primary, secondary)
- [x] Responsive layout works (buttons stack on mobile)
- [x] All 10 test scenarios render correctly

**Technical:**
- [x] Build compiles without errors
- [x] Block registers correctly with proper block.json configuration
- [x] All attributes defined with correct types and defaults
- [x] No markup duplication
- [x] TSX/PHP structure matches (same elements, classes, conditionals)
- [x] Test page uses DemoContainer wrappers correctly

## Changelog

| Timestamp | Change |
|-----------|--------|
| 2026-02-12 22:40 PST | Planning: Accessibility audit completed. Block identified for review. 1 PHP a11y fix needed (decorative bg image). Test page rebuild planned with 10 DemoContainer scenarios. |
| 2026-02-12 22:46 PST | Development: PHP accessibility fix applied (alt="", aria-hidden="true" on decorative background image). Test page rebuilt with 10 comprehensive DemoContainer scenarios covering color/image backgrounds, minimal/full content, long content edge cases, single button, custom focal point, and no-heading variant. Build passes. |
| 2026-02-12 22:49 PST | Functional QA: 9/10 checks passed. Build, lint, registration, attributes, edge cases, accessibility, and markup duplication all PASS. 1 minor issue: missing PHP docblock for camelCase variable documentation. Block is production-ready. |
| 2026-02-12 22:51 PST | Report: Block report generated. Call to Action block documented with full accessibility compliance, responsive behavior across all breakpoints, and comprehensive test coverage. Minor docblock issue documented. Ready for production. Note: Production Readiness section and Files Created/Modified section from original report have been removed as they were redundant with other sections. |
| 2026-02-18 PST | Added 3-button default template to block.json `attributes.buttons.default` (one primary, one secondary, one tertiary). New block instances now start with 3 button slots matching the ThemeHeading convention. Previously the `buttons` attribute had no default, just `"type": "array"`. |
| 2026-02-23 PST | Updated block.json example: viewportWidth 1400→1440, added picsum image URL (id/666) with backgroundType "image" for block preview. |
| 2026-03-09 PST | Changed section spacing from margin (`my-16 md:my-24`) to padding (`py-16 md:py-24`) for consistency with other blocks. Both TSX and PHP updated. |
| 2026-03-09 PST | BH #80 #77 #74 #64 #62 #61 #47 #44 #35 #33 #32 #29 #27 #22 #17 #16 #15 #13 #12 #10: ThemeHeading spacing fixes. Heading-to-description spacing increased to 48px (`not-group-last:mb-12`), description-to-buttons spacing set to 32px (`not-last:mb-8`). Added `theme-heading` class to wrapper for tertiary button padding scoping. Tertiary buttons inside ThemeHeading now have `padding-top/bottom: calc(1rem + 1px)` to match primary/secondary touch area. |
| 2026-03-09 PST | Button row gap changed from `gap-4` to `gap-x-4 gap-y-2` (8px row-gap) on ThemeHeading buttons wrapper and ButtonRow block (PHP + TSX). |
