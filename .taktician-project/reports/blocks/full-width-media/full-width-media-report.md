# Block Report: Full Width Media

**Date:** 2026-02-12 22:12 PST (Revision 1)
**Test Page:** https://ign.localhost/test-full-width-media/
**Figma Source:** None available

## Requirements

### User Requirements

- [x] Support image media type with focal point control
- [x] Support video media type with multiple sources (file, YouTube, Vimeo)
- [x] Display optional eyebrow text above heading
- [x] Display heading as semantic section landmark
- [x] Display optional description text
- [x] Support up to 3 buttons with configurable variations (primary, secondary, tertiary)
- [x] Video play button with accessible label and icon
- [x] Responsive layout (full-width media area with content section)
- [x] Accessibility compliance (WCAG 2.1 Level AA)
- [x] Comprehensive test page with all attribute combinations

### Block Type Requirements

No block type requirements documented.

## Block Behavior

**User-facing description of what the block does, written in layman's terms.**

### Media Display

The block displays a full-width media area (image or video) below a content section. On desktop, content and media are arranged vertically (content above, media below). On mobile, the layout adjusts to ensure proper spacing and readability.

### Supported Media Types

- **Images:** Display as responsive images with optional focal point positioning to control which area of the image is emphasized
- **Self-hosted video files:** Display with a poster image overlay and a clickable play button that reveals the video player
- **YouTube videos:** Embed via iframe with optional poster image overlay. When a poster is set, clicking the play button shows the YouTube player
- **Vimeo videos:** Embed via iframe with optional poster image overlay. When a poster is set, clicking the play button shows the Vimeo player

### Content Areas

- **Eyebrow (optional):** Small text label above the heading, hidden when empty
- **Heading:** Required; used as the section's accessible name for screen readers
- **Description (optional):** Body text content, hidden when empty
- **Buttons (optional):** Up to 3 configurable buttons with primary, secondary, or tertiary styling. Button row is hidden when no buttons are present.

### Responsive Behavior

- Desktop: Content and media maintain generous spacing (gap-16)
- Mobile: Spacing reduces to match mobile viewport (gap-9)
- All optional fields hide cleanly when empty, preventing orphaned whitespace

### Interactive States

- Play buttons are keyboard accessible (native `<button>` elements)
- Video controls (HTML5) are keyboard accessible for native video and embedded players
- All buttons show focus outline for keyboard navigation
- Hover effects on buttons provide visual feedback

## Development Notes

### Accessibility Improvements

This block was updated with comprehensive accessibility improvements to achieve WCAG 2.1 Level AA compliance:

**Critical Fixes:**
- **Play button accessible name:** Added `aria-label="Play video"` to all play button elements. The icon is decorative and hidden with `aria-hidden="true"` to prevent redundant announcements by screen readers.
- **Iframe titles:** All video iframes (YouTube, Vimeo, self-hosted) now include `title="Video player"` for proper landmark identification. This includes both pre-rendered iframes (when no poster image) and dynamically-injected iframes (when play button is clicked).

**Major Fixes:**
- **Section landmark identification:** The section element uses `aria-labelledby` pointing to the heading element's auto-generated ID (via the theme's `theme_block_props()` helper), providing clear landmark navigation for screen reader users. A fallback `aria-label="Full Width Media"` is used when no heading is present.

**Minor Fixes:**
- **Poster image alt text:** Poster images inside play buttons use `alt=""` (empty) since they are decorative—the play button's `aria-label` provides the accessible description.

### Design Decisions

- **Section landmark pattern:** Follows the same aria-labelledby approach as the Hero block, using the theme's auto-ID system for consistency across blocks
- **Iframe title attribute:** Generic title "Video player" is used for all embedded videos to meet WCAG 4.1.2 (Name, Role, Value) without requiring dynamic content
- **Play button with icon:** Uses a native `<button>` element with aria-label for accessible name, allowing the decorative SVG icon to be hidden without breaking functionality
- **Responsive spacing:** Uses Tailwind responsive classes (sm:) to manage gap sizes (gap-9 on mobile, gap-16 on desktop)

### Revision 1 Fixes Applied

**FQA-001 - @var Docblock (Resolved):** Added comprehensive @var docblock to `/blocks/FullWidthMedia/FullWidthMedia.php` documenting all auto-extracted variables ($anchor, $eyebrow, $heading, $description, $buttons, $mediaType, $image, $videoSource, $videoFile, $videoId, $posterImage). Eliminates PHP_CodeSniffer warnings and improves IDE intellisense.

**USR-001 - Tertiary Button Arrow Sizing (Resolved):** Removed hardcoded width='21' and height='16' attributes from `resources/images/tertiary-arrow.svg`. Kept only viewBox attribute, allowing SVG to scale properly within its container (w-5 h-4). Arrow now renders at correct size instead of at intrinsic size.

**USR-002 - Video Aspect Ratio (Resolved):** Changed video container from fixed heights (h-[294px] sm:h-[600px]) to aspect-video (16:9). Changed video element from object-contain back to object-cover for proper fill without letterboxing. Applied changes in both PHP (FullWidthMedia.php) and TSX (FullWidthMedia.tsx) for consistency.

## Issues to Address

None.

## Test Results

### Validation Summary

| Property | Value |
|----------|-------|
| **Last Test Type** | Full (Revision 1) |
| **Overall Status** | PASS (0 Issues) |
| **Breakpoints Tested** | 375px, 768px, 1024px, 1440px |
| **Browsers Tested** | Chromium |
| **Variations Tested** | 12 instances covering all media types and content combinations |
| **Build Status** | Passing (no TypeScript errors, build succeeds) |
| **Revision 1 Fixes** | @var docblock added, tertiary button arrow sizing fixed, video aspect ratio corrected, interactive video player tests verified |

### Screenshots

#### Interactive Test Verification

| Test Case | Browser | Link |
|-----------|---------|------|
| YouTube play button click | Chromium 1440px | [view](screenshots/full-width-media-youtube-play-1440w.png) |
| Vimeo play button click | Chromium 1440px | [view](screenshots/full-width-media-vimeo-play-1440w.png) |

### Test Cases

| Test Case | Status | Notes |
|-----------|--------|-------|
| Build compilation | Pass | No TypeScript errors, expected performance warnings |
| Block registration | Pass | All required files present and valid (block.json, index.tsx, PHP, JS, SVG) |
| Attributes | Pass | All attributes properly typed with defaults |
| Minimal content (heading + image) | Pass | Optional fields properly hidden |
| Full content (all fields + image) | Pass | All fields render correctly with 2 buttons |
| Video file with poster | Pass | Self-hosted video with play button interaction |
| YouTube with poster | Pass | Poster overlay with play button triggering iframe |
| YouTube without poster | Pass | Direct iframe embed, title attribute verified |
| Vimeo with poster | Pass | Poster overlay with play button triggering iframe |
| Vimeo without poster | Pass | Direct iframe embed verified |
| Long content stress test | Pass | Long text (100+ char heading, 500+ char description) renders without overflow |
| No eyebrow | Pass | Block renders correctly without eyebrow field |
| No buttons | Pass | Block renders correctly without buttons array |
| No media | Pass | Media container properly hidden when no image/video set |
| Play button interaction (YouTube) | Pass | Clicking play button replaces poster with YouTube iframe (autoplay=1) |
| Play button interaction (Vimeo) | Pass | Clicking play button replaces poster with Vimeo iframe (autoplay=1) |
| Accessibility (aria-label on play buttons) | Pass | All play buttons have aria-label="Play video" |
| Accessibility (title on iframes) | Pass | All iframes have title="Video player" |
| Accessibility (section landmark) | Pass | Section has aria-labelledby (auto-ID) or aria-label fallback |
| Accessibility (decorative icon hidden) | Pass | Play icon span has aria-hidden="true" |
| Accessibility (decorative image alt text) | Pass | Poster image inside button has alt="" |
| Keyboard navigation | Pass | Play button is keyboard accessible, video controls work with keyboard |
| TSX/PHP sync | Pass | TSX and PHP produce identical structure and accessibility attributes |

### What Matched

**Functionality**
- [x] Image display with focal point control
- [x] Self-hosted video with poster and play button
- [x] YouTube embed with and without poster
- [x] Vimeo embed with and without poster
- [x] Responsive spacing (gap-9 on mobile, gap-16 on desktop)
- [x] Optional content fields (eyebrow, description, buttons)
- [x] Play button interaction replacing poster with video player

**Accessibility**
- [x] Aria-label on play buttons for accessible name
- [x] Title attributes on all iframes for landmark identification
- [x] Aria-labelledby on section element pointing to heading
- [x] Aria-label fallback on section when heading is absent
- [x] Aria-hidden on decorative play icon
- [x] Alt="" on decorative poster images
- [x] Native button elements for keyboard navigation
- [x] Native HTML5 video controls for embedded players

**Code Quality**
- [x] Build passes without TypeScript errors
- [x] Block registers with all required files
- [x] All attributes have proper types and defaults
- [x] TSX and PHP structure match perfectly
- [x] PHP template uses auto-extracted attributes (no manual extraction)
- [x] Test page has 12 instances with real media IDs

## Changelog

| Timestamp | Change |
|-----------|--------|
| 2026-02-12 20:45 PST | Planning: Identified accessibility gaps (aria-label missing on play buttons, iframes lack title, section lacks landmark identification) |
| 2026-02-12 20:49 PST | Development: Applied accessibility fixes to PHP, TSX, and JS. Updated test page with 12 comprehensive DemoContainer-wrapped instances covering all media types and content combinations. Build passes, linter auto-fixed unused imports. |
| 2026-02-12 20:53 PST | Functional QA: 10 checks run, 9 passed, 1 minor issue (FQA-001: missing @var docblock). All accessibility fixes verified. Play button interactions tested and confirmed. 12 test variations verified. |
| 2026-02-12 20:57 PST | Report: Block report generated documenting accessibility improvements, comprehensive test coverage, and single minor issue requiring documentation update. |
| 2026-02-12 22:12 PST | Revision 1: Fixed FQA-001 by adding @var docblock to PHP template. Fixed USR-001 by removing hardcoded SVG dimensions from tertiary-arrow.svg. Fixed USR-002 by changing video container to aspect-video and element to object-cover. Verified self-hosted video player load and YouTube iframe injection work correctly. All fixes verified, 0 issues remaining. |
| 2026-02-18 PST | Replaced `rounded-3xl` border-radius with `default-mask` CSS class on the outer media containers (image container and video container). The `default-mask` class uses a CSS mask for the rounded shape. Inner `rounded-xl` on media elements within the padded container kept as-is. Applied to both TSX and PHP. |
| 2026-02-18 PST | Added 3-button default template to block.json `attributes.buttons.default` (one primary, one secondary, one tertiary). New block instances now start with 3 button slots matching the ThemeHeading convention. Previously the `buttons` attribute had no default, just `"type": "array"`. |
| 2026-02-23 PST | Updated block.json example: viewportWidth 1400→1440, replaced repeated picsum image URLs (957→972 for image, 957→976 for posterImage). Updated URL format to picsum.photos/id/{id}/{w}/{h}. |
| 2026-03-09 PST | BH #99: Replaced padding-based border (`bg-charcoal p-[18px] sm:p-8` + `rounded-xl`) with pseudo-element border approach. Outer wrapper has two pseudo-elements (`before:` top half, `after:` bottom half) with negative insets (`-inset-[18px] sm:-inset-[2rem]`) so the border extends beyond the media. Inner wrapper has `default-mask overflow-hidden z-1` to clip the media. Removed `rounded-xl` from all inner media elements. Both TSX and PHP updated. |
| 2026-03-09 PST | BH #80 #77 #74 #64 #62 #61 #47 #44 #35 #33 #32 #29 #27 #22 #17 #16 #15 #13 #12 #10: ThemeHeading spacing fixes. Heading-to-description spacing increased to 48px (`not-group-last:mb-12`), description-to-buttons spacing set to 32px (`not-last:mb-8`). Added `theme-heading` class to wrapper for tertiary button padding scoping. Tertiary buttons inside ThemeHeading now have `padding-top/bottom: calc(1rem + 1px)` to match primary/secondary touch area. |
| 2026-03-09 PST | Button row gap changed from `gap-4` to `gap-x-4 gap-y-2` (8px row-gap) on ThemeHeading buttons wrapper and ButtonRow block (PHP + TSX). |
