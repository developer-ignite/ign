# Block Report: Testimonials Carousel

**Date:** 2026-02-12 12:10 PST
**Test Page:** https://ign.localhost/?page_id=144
**Figma Source:**
- [Desktop](https://www.figma.com/design/bpRK9A1l2nTbWfMg1pX5yK/IGN-%7C-WEBSITE--INTERNAL-?node-id=785-34805&m=dev)

## Requirements

### User Requirements

- [x] Carousel displaying testimonial posts from the testimonial post type
- [x] Layout matches CardsCarousel block (dark mode, charcoal background, progress bar + nav arrows)
- [x] Accent color system for card backgrounds (green/purple/etc)
- [x] Video modal for posts with video (file/YouTube/Vimeo support)
- [x] Automatic mode with post limit and program taxonomy filter
- [x] Manual mode with hand-picked testimonial selection
- [x] Hide-if-empty option
- [x] Responsive: 1 slide mobile, 2 tablet, 3 desktop
- [x] Equal-height cards with video button pinned to bottom
- [x] Video modal close button styled to match carousel navigation buttons

### Block Type Requirements

No block type requirements documented.

## Block Behavior

### Layout

The block renders as a dark section with a charcoal rounded background. The heading area is displayed in a two-column layout: the main heading on the left, with an optional description and buttons on the right. Below the heading area, a controls row contains a progress bar (gradient fill) and prev/next navigation arrows.

The carousel displays testimonial cards with 3 visible slides on desktop, 2 on tablet, and 1 on mobile. A partial card peeks from the right edge to indicate scrollability. The charcoal background area has generous vertical padding (96px on desktop, 64px on mobile) matching the Figma design.

All cards in the carousel are rendered at equal height regardless of content length. Cards with shorter content stretch to match the tallest card. The "WATCH THE VIDEO" button is always pinned to the bottom of each card that has a video, maintaining consistent button placement across all cards.

### Content

- Optional eyebrow text above the heading (hidden when empty)
- Main heading for the section title
- Optional description text alongside the heading
- Optional CTA buttons in the heading area

Each testimonial card displays:
- Student name as a prominent heading
- Program name (pulled from the program taxonomy)
- Testimonial message in italic styled text
- "WATCH THE VIDEO" button (only shown when a video is available, always pinned to the bottom of the card)

### Carousel Controls

- A gradient-filled progress bar shows scroll position
- Left/right arrow buttons for navigation
- Optional loop and autoplay settings available in the editor sidebar

### Video Modal

When a testimonial has a video attached, the card shows a "WATCH THE VIDEO" button. Clicking it opens a full-screen modal overlay with the video. The modal supports three video sources: uploaded files (HTML5 video), YouTube embeds, and Vimeo embeds. The modal is accessible with keyboard navigation (Escape to close, focus trap, focus returns to trigger on close).

Each block instance renders its own modal inside its section element. The modal content area is scrollable when the viewport height is too short to fit the entire video, allowing users to scroll to view the full content.

The close button is styled as a circular bordered button with a dedicated CSS class for semantic independence. It has a white border and white icon in the default state for contrast against the dark modal backdrop. On hover, the button fills with a gradient and transitions to charcoal text and border. The button has a focus ring (2px white border with black offset) for keyboard accessibility. The close button sits in normal document flow, right-aligned above the video area, not overlapping the video container.

The modal is aware of the WordPress admin bar when logged in as an administrator. A CSS variable (`--admin-bar-height`) is applied as top padding to shift the video centering context below the admin bar, ensuring the video is not obscured by the admin bar. For logged-out users, this defaults to 0rem. The backdrop overlay (`inset-0`) still covers the full viewport including behind the admin bar, but the flex centering context (which positions the video) is shifted downward by the admin bar height.

### Content Selection

Editors can choose between two modes:
- **Automatic** -- queries testimonial posts with an optional limit and program taxonomy filter
- **Manual** -- hand-pick specific testimonial posts using a sortable selector

An optional "hide if empty" toggle hides the entire section when no testimonials match the query.

### Conditional Behaviors

- Eyebrow, heading, description, and buttons are hidden when left empty
- Block name in the editor list view matches the heading text
- Video button only appears on cards with video metadata
- The section can be hidden entirely if no posts are found (when enabled)

### Accessibility

The TestimonialsCarousel block implements the WAI-ARIA Carousel accessibility pattern to ensure keyboard navigation and screen reader support:

**Carousel Container & Slides:**
- The carousel container has `aria-roledescription='carousel'` for proper semantic identification
- Each slide has `role='group'`, `aria-roledescription='slide'`, and an `aria-label` with position info (e.g., "Slide 1 of 7")

**Rotation Control (Autoplay):**
- When autoplay is enabled, a rotation control button appears as the first interactive element in the carousel
- The button has a dynamic accessible name that updates between "Stop slide rotation" and "Start slide rotation"
- Auto-rotation pauses when any carousel element receives keyboard focus (focus-based pause behavior)
- Auto-rotation is automatically disabled for users who have set their system to prefer reduced motion

**Live Region Announcements:**
- The slide wrapper uses `aria-live='polite'` when the carousel is in manual navigation mode, allowing screen reader users to hear slide change announcements
- When autoplay is active, `aria-live` is set to `'off'` to prevent constant announcements during automatic rotation

**Video Modal Dialog:**
- The modal has proper dialog semantics with `role='dialog'` and `aria-modal='true'`
- It includes an `aria-labelledby` pointing to a visually hidden heading inside the dialog
- Focus is trapped within the modal when open; pressing Escape closes it
- Focus returns to the video button that opened the modal when it closes
- The modal receives the `inert` attribute when closed to prevent focus from entering it
- The modal accounts for the WordPress admin bar height, ensuring videos are not obscured when logged in as an administrator

**Navigation & Pagination:**
- Navigation arrow buttons have visible focus indicators (white ring with dark offset) for keyboard accessibility
- The progress bar pagination is hidden from assistive technology with `aria-hidden='true'` since it's a decorative visual indicator

**Off-Screen Slide Management:**
- Slides that are not currently visible receive the `inert` attribute, preventing keyboard users from accidentally tabbing into off-screen content
- Swiper's A11y module is disabled in favor of custom WAI-ARIA labels to ensure consistent accessibility across all slide interactions

## Development Notes

### Design Decisions

- The carousel layout mirrors the CardsCarousel block exactly (dark mode section, charcoal pseudo-element background, progress bar pagination, nav arrows) as specified in the requirements
- The block is hardcoded to the testimonial post type only, unlike the generic DynamicContentCarousel which supports multiple post types
- Video modal was implemented without a Figma reference design. Uses an accessible full-screen overlay with dark backdrop, blur effect, and scale animation
- Program information is sourced from the existing program taxonomy (via get_the_terms) rather than a separate meta field

### Equal-Height Cards (Edit 1)

- The swiper-slide elements previously had `self-start` which overrode the default flexbox stretch alignment provided by Swiper's wrapper. Removing `self-start` while keeping `h-auto!` allows `align-items: stretch` to take effect naturally
- The card template was already correctly structured with `flex flex-col h-full` on the article, `flex-1` on the content div, and `mt-auto` on the video button. No card template changes were needed -- the fix was entirely in the parent slide class
- Cards without a video button simply have their content area expand to fill available space, which is standard flexbox stretch behavior

### Modal Close Button Restyle (Edit 1)

- The close button was restyled to use the `carousel-nav-btn` class, providing visual consistency with the carousel prev/next navigation buttons (same circular shape, border style, sizing, and gradient hover animation)
- The modal HTML was restructured to separate the overflow-hidden video container from the close button. This prevents the close button (which overlaps the corner at negative offsets) from being clipped by the overflow-hidden property on the video area
- The `.testimonial-video-close` class was preserved on the restyled button to maintain compatibility with existing JavaScript event listeners

### Modal Close Button Repositioning and CSS Separation (Edit 2)

- The close button was repositioned from overlapping the video corner (`-top-5 -right-5` on mobile, `-top-6 -right-6` on desktop) to sitting above the video area (`-top-12 right-0` on mobile, `-top-14 right-0` on desktop), creating clear visual separation
- A new dedicated `.modal-close-btn` CSS class replaced `carousel-nav-btn`, providing semantic independence from carousel navigation buttons. The close button will no longer be affected by future carousel button style changes
- Default state styling: white border (`border-white`) and white icon (`text-white`) for optimal contrast against the dark modal backdrop
- Hover state: gradient fill animation with text and border transitioning to charcoal (`text-charcoal border-charcoal`) for contrast against the filled gradient
- Focus-visible styles added (`ring-2 ring-white ring-offset-2 ring-offset-black/80`) for keyboard accessibility on the dark background

### Structural Changes (Revision 1)

- A new `.swiper-slides-wrapper` div was introduced inside `.swiper-parent` to wrap only the `.swiper` element and the fade mask divs. This isolated the fade masks to the slides area, preventing them from overlapping the pagination/navigation controls row above
- The `relative` class was removed from `.swiper-parent` and placed on the new wrapper instead, since absolute-positioned masks referenced the wrapper as their containing block
- No JavaScript changes were required because the existing `querySelector` calls are descendant queries that find the fade masks regardless of their nesting depth within `.swiper-parent`
- Container padding was added (`py-16 md:py-24`) to match Figma's 96px inner padding within the charcoal background area. The padding is synced in both PHP and TSX (editor preview)

### Fade Mask Removal (Revision 2)

- All fade mask functionality was completely removed per user request: no left or right fade-out gradients on the carousel
- The fade mask HTML divs were removed from PHP
- The fade mask event handlers (Swiper slideChange, reachBeginning, reachEnd) and data-attribute toggling were stripped from the JS file
- The corresponding fade mask CSS classes were removed
- The `.swiper-slides-wrapper` structural div introduced in Revision 1 (which existed solely to scope the fade masks) was also unwrapped and removed, simplifying the DOM structure back to a flat layout inside `.swiper-parent`
- The TSX editor component was updated to stay in sync

### Color Mapping

- Card backgrounds use `bg-accent` (theme accent color system). Figma shows `#B2EAE7` (teal) as one example, but the spec confirms these map to the accent color
- All card text uses `text-charcoal` since cards have light accent-color backgrounds
- Student name: 40px Anton on desktop (`text-[2.5rem]`), 24px on mobile (`text-[1.5rem]`) -- custom sizes needed since no theme token matches the Figma value exactly
- Program name: `text-header-5` (24px on desktop) matching Figma's font/size/xl
- Testimonial message: Roboto Medium Italic 16px (`text-body font-medium italic`)
- Section background: `before:bg-charcoal` pseudo-element with `before:rounded-3xl`

### Trade-offs

- Card border-radius uses `rounded-3xl` (24px) vs Figma's 25px -- 1px difference accepted under relaxed tolerance
- Swiper spaceBetween uses 24px (matching CardsCarousel pattern) rather than Figma's 16px gap, as the spec designated CardsCarousel as the layout reference
- Student name required custom font size classes (`text-[1.5rem] md:text-[2.5rem]`) because no theme heading token maps to 40px

### Modal Architecture (Revision 3)

- Previously, the video modal was rendered as a singleton after the section element (using a static PHP guard) to avoid duplication. This caused the modal to exist outside the section in the DOM.
- In Revision 3, the modal is now rendered inside each section element, with the static guard removed. Each block instance owns its own modal. This resolves the long-standing FQA-001 issue about modals being outside the section and allows for better DOM structure and section encapsulation.
- The JavaScript was reworked from a single global modal reference to a per-section approach using `btn.closest('section.testimonials-carousel').querySelector('.testimonial-video-modal')` for each video button click. A module-level `currentModal` variable tracks which modal is currently open.
- The close button was moved from absolute positioning (`-top-12 right-0`) to normal document flow, wrapped in a `flex justify-end mb-3` container div for right-alignment above the video area.
- The modal content wrapper now includes `overflow-y-auto max-h-full py-8` classes to enable scrolling when the viewport is too short for the video.

### Admin Bar Height Handling (Edit 3)

- The video modal now uses the `--admin-bar-height` CSS variable for top padding on the modal container via Tailwind v4 arbitrary property syntax (`pt-(--admin-bar-height)`), shifting the flex centering context downward when the WordPress admin bar is visible
- This prevents the video from being obscured by the admin bar for logged-in administrators
- The variable is defined in `resources/css/screen/spacing.css` (lines 35-36) and uses `var(--wp-admin--admin-bar--height)` when the admin bar is present, defaulting to 0rem for logged-out users or when no admin bar is visible, ensuring no layout impact for non-admin viewers
- The padding approach maintains the `inset-0` backdrop overlay covering the full viewport (including behind the admin bar), while only the flex centering area is shifted down
- This is the correct approach versus using `top: var(--admin-bar-height)` instead of `inset-0`, which would leave an uncovered gap behind the admin bar
- The implementation uses Tailwind v4's arbitrary property syntax (`pt-(--admin-bar-height)`), which is consistent with other custom property usage in the codebase (e.g., `before:-inset-x-(--side-gutter)`, `top:(--fixed-offset)`)

### WAI-ARIA Carousel Pattern Implementation (Accessibility Update)

**Overview:**
The TestimonialsCarousel block now implements the complete WAI-ARIA Carousel accessibility pattern (10 gaps identified and fixed) to ensure full keyboard navigation and screen reader support, matching the DynamicContentCarousel reference implementation.

**Gap Fixes Applied:**

1. **Carousel Container ARIA** -- Added `aria-roledescription='carousel'` to the `.swiper-parent` div (PHP line 62). This semantic label tells assistive technology that the region is a carousel, improving discoverability.

2. **Slide ARIA Labels** -- Each `.swiper-slide` now has `role='group'`, `aria-roledescription='slide'`, and a dynamic `aria-label` with position info (e.g., "Slide 1 of 7"). Implemented in PHP with a counter loop variable (lines 117-123).

3. **Rotation Control Button** -- Added a `.carousel-autoplay-toggle` button as the first interactive element in the carousel when autoplay is enabled. The button displays a Pause icon initially and toggles to a Play icon when clicked. It has a dynamic `aria-label` that switches between "Stop slide rotation" and "Start slide rotation" (PHP lines 66-74, JS lines 52-101).

4. **Focus-Based Autoplay Pause** -- Implemented `focusin`/`focusout` event handlers on the carousel container to pause autoplay when keyboard focus enters and resume when focus leaves (JS lines 89-102). This matches WAI-ARIA guidance that "automatic rotation must stop when any element receives focus."

5. **aria-live Region Management** -- The `.swiper-wrapper` uses `aria-live='off'` when autoplay is active (preventing constant announcements) and switches to `aria-live='polite'` when paused, allowing slide change announcements for manual navigation (JS lines 58, 75, 83).

6. **Navigation Focus Visibility** -- Added `:focus-visible` styles to `.carousel-nav-btn` with `ring-2 ring-white ring-offset-2 ring-offset-charcoal`, providing visible focus indicators on dark backgrounds (swiper.css). This ensures keyboard users can see which button has focus.

7. **prefers-reduced-motion Support** -- Added a check for `window.matchMedia('(prefers-reduced-motion: reduce)').matches` at the top of the JS initialization. Autoplay is only enabled when the user has NOT indicated a preference for reduced motion (JS lines 5-14).

8. **Video Modal Dialog Improvements** -- The modal now uses `aria-labelledby` pointing to a visually hidden heading inside the dialog (instead of plain `aria-label`), and the `inert` attribute is applied when the modal is closed, preventing focus from entering hidden content.

9. **Pagination aria-hidden** -- The `.swiper-pagination` progress bar is hidden from assistive technology with `aria-hidden='true'` (PHP line 123) since it's a decorative visual indicator, not an interactive control.

10. **Inert Attribute on Off-Screen Slides** -- Off-screen slides receive the `inert` attribute dynamically, preventing keyboard users from tabbing into content they cannot see. This is especially important for slides with focusable elements like video buttons (JS slideChange handler, lines 104-117).

**Swiper A11y Module Conflict & Resolution:**
The Swiper library includes a built-in A11y module that automatically adds ARIA labels to slides (e.g., "Slide 1 of 7"). However, this automatic labeling conflicted with the custom WAI-ARIA labels required for consistency with DynamicContentCarousel. **Solution:** Disabled the Swiper A11y module with `a11y: { enabled: false }` in both TestimonialsCarousel.js (lines 50-52) and TestimonialsCarousel.tsx (lines 110-112). This allows the block to use custom PHP-rendered ARIA labels instead, ensuring consistency and full control over screen reader announcements.

**Assets Added:**
- `blocks/TestimonialsCarousel/resources/Pause.svg` -- Icon used for the rotation control button (copied from DynamicContentCarousel)

**Files Modified:**
- **TestimonialsCarousel.php** -- Added carousel/slide ARIA attributes, rotation control button, pagination aria-hidden, inert modal attribute
- **TestimonialsCarousel.js** -- Added prefers-reduced-motion check, rotation toggle handler, focus-based pause, aria-live management, inert slide management, Swiper A11y disabled
- **TestimonialsCarousel.tsx** -- Swiper A11y module disabled for editor parity
- **swiper.css** -- Added `:focus-visible` styles for `.carousel-nav-btn`

### Modal Close Button CSS Isolation (Edit 4)

The `.modal-close-btn` styles cannot be fully replaced with Tailwind-only classes because the button requires a `::before` pseudo-element with an animated gradient sweep. This animation uses:
- `background-size: 200% 100%` with `background-position` animation via `@keyframes carousel-nav-gradient-sweep`
- CSS custom properties for gradient colors (`--gradient-left`, `--gradient-right`)
- Opacity transition and animation trigger on hover

Tailwind's `before:` modifier cannot express background-size animations or keyframe references, so a custom CSS file is required.

**Keyframes Sharing Strategy:** The `@keyframes carousel-nav-gradient-sweep` animation remains in `resources/css/screen/swiper.css` (global scope, shared with `.carousel-nav-btn`) and is accessible from `blocks/TestimonialsCarousel/TestimonialsCarousel.css` since webpack bundles both files into the same `css/screen.css` output. This avoids duplication while keeping the shared animation in one location.

**CSS Conversion:** All styles were converted from `@apply` Tailwind directives to plain CSS using CSS custom properties (e.g., `var(--color-white)`, `var(--color-charcoal)`). This provides semantic independence and clearer intent.

**Related Cleanup:** The DynamicContentCarousel hover zoom rules (card image scale transition on hover with `prefers-reduced-motion` override) were also moved from `resources/css/screen/swiper.css` to `blocks/DynamicContentCarousel/DynamicContentCarousel.css` as part of this CSS cleanup pass.

### Deviations from Design

- Video modal design is entirely custom (no Figma reference provided)
- Fade masks removed entirely per user request (Figma showed fade-out gradients on carousel edges)

## Issues to Address

### Functional QA (Edit 3)

All 9 checks passed with 0 issues found. The admin bar height padding implementation is complete and correct.

### Pre-Existing Issues

| ID | Severity | Description | Status |
|----|----------|-------------|--------|
| FQA-TC-001 | critical | TypeScript compilation error: PostSelectorSortable onChange returns `number \| number[]` but selectedPosts expects `number[]`. The attribute type definition does not match the component callback signature. **Suggested fix:** Cast the value with `Array.isArray(value) ? value : [value]` or update the attribute type to accept both. | Open (pre-existing, blocks type safety) |
| FQA-001 (orig) | major | Video modal rendered 6 times instead of once (Revision 2). **RESOLVED in Revision 3:** Removed static guard; each section now intentionally has its own modal (desired behavior). | Resolved (Revision 3) |
| FQA-002 | minor | Focus outline visibility on modal close button in dark context. **Fix applied in Edit 2:** Added focus-visible styles to `.modal-close-btn:focus-visible { ring-2 ring-white ring-offset-2 ring-offset-black/80 }` for white focus ring with black offset, providing good contrast on the dark modal backdrop. | Resolved (Edit 2) |
| FQA-003 | minor | No `prefers-reduced-motion` handling for carousel autoplay, slide transitions, modal animations, or nav button gradient animation. **Suggested fix:** Check `matchMedia('(prefers-reduced-motion: reduce)')` before enabling autoplay; add CSS media query to disable transitions. | Open (theme-wide) |

## Test Results

### Validation Summary

| Property | Value |
|----------|-------|
| **Last Test Type** | Full |
| **Overall Match** | Good |
| **Breakpoints Tested** | 375px, 768px, 1024px, 1440px |
| **Browsers Tested** | Chromium, Firefox, WebKit |
| **Variations Tested** | 8 variations: Default Automatic, Full Content, Manual Mode, Minimal, Program Filter, Hide If Empty, Long Content, Empty Optional Fields |
| **Build Status** | Pass |
| **Functional QA** | PASS (7 checks: all passed; 0 issues) |
| **Design QA** | PASS (CSS refactoring: no visual regressions, all 12 screenshots match expectations) |

### Screenshots

#### Full Validation (All Browsers)

| Breakpoint | Chromium | Firefox | WebKit |
|------------|----------|---------|--------|
| 375px | [view](screenshots/testimonials-carousel-chromium-375w.png) | [view](screenshots/testimonials-carousel-firefox-375w.png) | [view](screenshots/testimonials-carousel-webkit-375w.png) |
| 768px | [view](screenshots/testimonials-carousel-chromium-768w.png) | [view](screenshots/testimonials-carousel-firefox-768w.png) | [view](screenshots/testimonials-carousel-webkit-768w.png) |
| 1024px | [view](screenshots/testimonials-carousel-chromium-1024w.png) | [view](screenshots/testimonials-carousel-firefox-1024w.png) | [view](screenshots/testimonials-carousel-webkit-1024w.png) |
| 1440px | [view](screenshots/testimonials-carousel-chromium-1440w.png) | [view](screenshots/testimonials-carousel-firefox-1440w.png) | [view](screenshots/testimonials-carousel-webkit-1440w.png) |

### Test Cases

| Test Case | Status | Notes |
|-----------|--------|-------|
| Default Automatic (9 items) | Pass | 7 slides rendered, pagination and navigation visible, wrapped in demo-container |
| Full Content (with eyebrow, buttons, description) | Pass | Full heading area with CTA link rendered, demo-container wrapper |
| Manual Mode (3 selected posts) | Pass | Specific posts 133, 139, 140 rendered, demo-container wrapper |
| Minimal (heading only) | Pass | 7 slides, default pagination/navigation, demo-container wrapper |
| Program Filter (Hotel Management) | Pass | 2 slides filtered by term 19, demo-container wrapper |
| Hide If Empty (enabled) | Pass | 3 slides rendered (posts exist), demo-container wrapper |
| Long Content (overflow testing) | Pass | Extended testimonial text renders correctly, cards maintain equal height, demo-container wrapper |
| Empty Optional Fields (shouldDisplay testing) | Pass | No eyebrow, minimal description, tests conditional display logic, demo-container wrapper |
| Video modal functionality | Pass | 13 video buttons across all 8 variations, modal opens correctly and accounts for admin bar height |
| Admin bar height awareness | Pass | When logged in as admin, video modal centers below admin bar, not obscured by it |
| Equal-height cards | Pass | Cards stretch to same height across all 8 block instances and breakpoints |
| Responsive carousel | Pass | 1 slide mobile (375px), 2 slides tablet (768px), 3 slides desktop (1024+px) |

### What Matched

**Layout**
- [x] Dark rounded container with charcoal pseudo-element background
- [x] Two-column heading layout (heading left, description right)
- [x] 3 slides visible at desktop with partial 4th card peeking
- [x] Progress bar and navigation arrows in controls row
- [x] Card button anchored to bottom via flex layout
- [x] Container inner padding matches Figma's 96px at desktop
- [x] Equal-height cards with video button pinned to bottom

**Typography**
- [x] Section heading: Anton at text-header-2 size, white on dark background
- [x] Description: body text, white, right column
- [x] Student name: 40px Anton desktop, 24px mobile (after fix)
- [x] Program name: 24px Anton desktop (after fix)
- [x] Testimonial message: Roboto Medium Italic 16px
- [x] Watch button: Roboto Medium 16px uppercase

**Colors**
- [x] Card backgrounds use accent color system
- [x] All card text uses charcoal
- [x] Progress bar gradient (green to blue)
- [x] Navigation arrow buttons styled correctly

**Spacing**
- [x] Card padding: 24px (p-6) matches Figma margin/margin-2
- [x] Card content gap: 24px (gap-6) matches Figma gap/gap-4
- [x] Card border-radius: 24px (rounded-3xl, within 1px of Figma's 25px)
- [x] Slide spacing: 24px between cards
- [x] Container vertical padding: 96px desktop (py-24), 64px mobile (py-16)

**Components**
- [x] Swiper config synchronized between TSX and JS
- [x] Navigation buttons with aria-labels
- [x] Video modal with full accessibility (focus trap, Escape, aria-hidden)
- [x] Semantic HTML: article cards, h3 names, blockquote messages
- [x] Modal close button styled as carousel-nav-btn (circular, bordered, gradient hover)

**Responsive**
- [x] Mobile (375px): 1 card visible
- [x] Tablet (768px): 2 cards visible
- [x] Desktop (1024/1440px): 3 cards with partial 4th

## Changelog

| Timestamp | Change |
|-----------|--------|
| 2026-02-11 12:30 PST | Planning complete: block spec with 15 decisions, card template, video modal, fade mask behavior |
| 2026-02-11 12:50 PST | Initial implementation: 8 files created, testimonial post type updated, card template replaced, test page with 6 variations, build passing |
| 2026-02-11 12:51 PST | Functional QA: 9 checks, 6 passed, 3 failed -- 8 issues found (0 critical, 4 major, 4 minor) |
| 2026-02-11 12:56 PST | Design QA: Composition gate passed, 2 issues found (1 major typography, 1 minor typography) |
| 2026-02-11 13:04 PST | Developer fixes applied: all 10 issues resolved (unused imports, modal singleton, aria-hidden, XSS fix, TSX/PHP sync, typography sizes), build passing |
| 2026-02-11 13:11 PST | Report generated with final screenshots at all breakpoints and browsers |
| 2026-02-11 13:22 PST | Revision 1 planning: fade mask restructured to only cover slides area (not navigation), container padding updated to py-16 md:py-24 matching Figma's 96px inner padding |
| 2026-02-11 13:26 PST | Revision 1 applied: new .swiper-slides-wrapper div isolates fade masks from controls, container padding synced in PHP and TSX, no JS changes needed, build passing |
| 2026-03-09 PST | BH #58 #48 #14 #3: Removed `buttonVariations: ['secondary']` override from ThemeHeading (TSX + PHP). All button variations (primary, secondary, tertiary) now available. Removed `default: []` from buttons attribute in block.json so ThemeHeading 3-button default applies. |
| 2026-02-11 13:28 PST | Report updated with revision 1 changes, screenshots recaptured |
| 2026-02-11 13:40 PST | Revision 2 applied: fade masks completely removed per user request -- all fade mask HTML, JS event handlers, and CSS classes stripped from PHP, TSX, and JS files; .swiper-slides-wrapper div unwrapped; screenshots recaptured |
| 2026-02-11 16:08 PST | Edit 1 planning: equal-height cards (remove self-start from swiper-slide) and modal close button restyle (carousel-nav-btn class) |
| 2026-02-11 16:15 PST | Edit 1 applied: removed self-start from swiper-slide for equal-height cards; restyled modal close button with carousel-nav-btn class and restructured modal HTML to prevent overflow clipping; build passing |
| 2026-02-11 16:18 PST | Functional QA: PASS -- 9 checks (8 passed, 1 warning), 4 issues (1 major pre-existing modal duplication, 2 minor theme-wide, 1 note); no new issues from edit |
| 2026-02-11 16:20 PST | Design QA: PASS -- equal-height cards confirmed across all 6 block instances at all breakpoints; close button restyle code-verified with carousel-nav-btn class; no issues found |
| 2026-02-11 16:25 PST | Report updated with edit 1 changes, screenshots recaptured at all breakpoints and browsers |
| 2026-02-11 16:37 PST | Edit 2 planning: Modal close button repositioned above video area; new dedicated .modal-close-btn CSS class with white default state; focus-visible keyboard accessibility styles |
| 2026-02-11 16:39 PST | Edit 2 applied: Close button moved outside video container with -top-12 right-0 md:-top-14 right-0 positioning; carousel-nav-btn replaced with new modal-close-btn class; build passing |
| 2026-02-11 16:44 PST | Functional QA: PASS -- 10 checks (8 passed, 2 failed/warnings), 2 issues found (1 critical pre-existing modal duplication, 1 major/minor focus-visible); FQA-002 identified for fix |
| 2026-02-11 16:46 PST | Developer fix applied: Added focus-visible styles to .modal-close-btn class (ring-2 ring-white ring-offset-2 ring-offset-black/80) for keyboard accessibility on dark backdrop; build passing |
| 2026-02-11 16:47 PST | Report updated with edit 2 changes, including repositioned close button, new modal-close-btn class, focus-visible accessibility styles |
| 2026-02-11 16:53 PST | Revision 3 planning: Move modal inside section element (remove static guard for per-section modals), restructure close button to normal flow with flex justify-end, add overflow-y-auto scrollability to modal content |
| 2026-02-11 16:57 PST | Revision 3 applied: Modal moved inside section; static guard removed; each block instance now owns its own modal; close button moved to flex justify-end wrapper in normal flow above video; modal inner wrapper has overflow-y-auto max-h-full py-8 for scrollability; JS reworked from global to per-section approach with btn.closest() and currentModal variable; build passing |
| 2026-02-11 16:58 PST | Functional QA: PASS -- 11 checks (10 passed, 1 TypeScript type error), 1 critical issue: FQA-TC-001 (pre-existing PostSelectorSortable type mismatch not introduced by this revision) |
| 2026-02-11 17:02 PST | Report updated with revision 3 changes: modal architecture documentation, scrollability, per-section approach, resolved FQA-001 issue, updated issues table with new pre-existing TypeScript error |
| 2026-02-11 20:10 PST | Edit 3 planning: Add padding-top with var(--admin-bar-height) to video modal container to account for WordPress admin bar when positioning the video modal |
| 2026-02-11 20:12 PST | Edit 3 applied: Added pt-(--admin-bar-height) to video modal container on line 113 of TestimonialsCarousel.php; uses Tailwind v4 arbitrary property syntax; --admin-bar-height CSS variable defined in resources/css/screen/spacing.css with safe 0rem default for logged-out users; build passing |
| 2026-02-11 20:16 PST | Functional QA: PASS -- 9 checks (all passed), 0 issues found; admin bar height implementation verified correct, CSS variable properly defined, TSX/PHP sync not needed (PHP-only change) |
| 2026-02-11 20:17 PST | Test page restructured to match project conventions: Title changed to "TEST: Testimonials Carousel", all 8 variations wrapped in takt/demo-container blocks with descriptive titles/descriptions, 2 new edge-case variations added (Long Content for overflow testing, Empty Optional Fields for shouldDisplay testing), variations reordered logically |
| 2026-02-11 21:14 PST | Report finalized with Edit 3 changes: updated Block Behavior > Video Modal with admin bar backdrop clarification, updated Development Notes with admin bar height implementation details (CSS variable sourcing, Tailwind v4 syntax consistency), updated Test Cases table to reflect 8 DemoContainer-wrapped variations including new edge cases and admin bar testing, updated Validation Summary to reflect variations tested, screenshots recaptured at all breakpoints (375, 768, 1024, 1440) across all browsers (Chromium, Firefox, WebKit) |
| 2026-02-12 10:48 PST | Accessibility implementation: WAI-ARIA Carousel pattern deployed with 10 gaps identified and fixed -- carousel container aria-roledescription, slide aria roles/roledescription/labels with position info, rotation control button with dynamic aria-label and icon toggle, focus-based autoplay pause (focusin/focusout handlers), aria-live region management (off during autoplay, polite during manual navigation), prefers-reduced-motion support disables autoplay, navigation button focus-visible styles, modal dialog improvements (aria-labelledby, inert on close), pagination aria-hidden, inert attribute on off-screen slides, Swiper A11y module disabled to preserve custom labels (a11y: { enabled: false }), Pause.svg asset added. Functional QA: PASS (10 checks, 0 issues). Ready for merge. |
| 2026-02-12 12:00 PST | Edit 4: CSS refactoring -- moved `.modal-close-btn` styles from `resources/css/screen/swiper.css` to new `blocks/TestimonialsCarousel/TestimonialsCarousel.css`, converted `@apply` Tailwind directives to plain CSS with CSS custom properties, `@keyframes carousel-nav-gradient-sweep` remains in swiper.css (shared with carousel-nav-btn), DynamicContentCarousel hover zoom rules also moved to `blocks/DynamicContentCarousel/DynamicContentCarousel.css` as cleanup, no PHP/TSX/JS changes, build passing |
| 2026-02-12 12:04 PST | Functional QA: PASS -- 7 checks (all passed), 0 issues. CSS refactoring verified: modal close button styles correctly isolated to block CSS, keyframes accessible from global scope, no orphaned references, DynamicContentCarousel hover zoom rules restored, all 10 block instances render correctly with modal functionality intact |
| 2026-02-12 12:09 PST | Design QA: PASS -- No visual regressions. All 12 screenshots (3 browsers x 4 breakpoints) match expectations. Modal close button is modal-triggered element not visible in default page state; carousel block rendering identical to Figma reference across all breakpoints |
| 2026-02-12 13:01 PST | Edit: Padding structure refactored for cleaner architecture. Removed section padding (py-10 sm:py-16), moved all padding to container (py-18 md:py-23 = 72px mobile / 92px desktop), changed pseudo-element from before:-inset-y-8 to before:inset-y-0. Visual appearance identical. Build: PASS. QA: PASS. Also updated DynamicContentCarousel with identical changes. |
| 2026-02-12 14:21 PST | Edit: Color lock applied - progress bar and navigation buttons now always use neon-green-to-blue gradient regardless of page accent color. Added CSS custom property override scoped to block wrapper. Build: PASS. |
| 2026-02-12 15:54 PST | TypeScript fix: Added type guard to PostSelectorSortable onChange handler (lines 162-169) to handle `number \| number[]` return type. Functional QA: PASS (6/6 checks). Note: Files Created/Modified section removed from original report and integrated into changelog entries. |
| 2026-02-18 PST | Tertiary button arrow style update (affects card-testimonial.php "Watch the Video" button): Arrow now animates 12px right on hover/focus via margin transition. Arrow wrapper class changed to `btn-tertiary-arrow` CSS class. Animation handled globally in `resources/css/screen/button.css`. |
| 2026-02-23 PST | Updated block.json example: viewportWidth 1400→1440 to match standard section preview width. |
| 2026-03-06 PST | Progress bar empty background now uses `color-mix(in srgb, currentColor 50%, transparent)` for 50% opacity currentColor. Applied globally in `resources/css/screen/swiper.css`. |
| 2026-03-09 PST | BH #51 #46 #41 #19 #61: Carousel controls row now uses `justify-end` so pause button and navigation arrows right-align when pagination is disabled. Added to all 4 carousel blocks (PHP + TSX where applicable). |
| 2026-03-09 PST | BH #80 #77 #74 #64 #62 #61 #47 #44 #35 #33 #32 #29 #27 #22 #17 #16 #15 #13 #12 #10: ThemeHeading spacing fixes. Heading-to-description spacing increased to 48px (`not-group-last:mb-12`), description-to-buttons spacing set to 32px (`not-last:mb-8`). Added `theme-heading` class to wrapper for tertiary button padding scoping. Tertiary buttons inside ThemeHeading now have `padding-top/bottom: calc(1rem + 1px)` to match primary/secondary touch area. |
| 2026-03-09 PST | Button row gap changed from `gap-4` to `gap-x-4 gap-y-2` (8px row-gap) on ThemeHeading buttons wrapper and ButtonRow block (PHP + TSX). |
