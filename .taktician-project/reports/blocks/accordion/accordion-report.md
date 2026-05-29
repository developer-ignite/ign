# Block Report: Accordion

**Date:** 2026-02-13 20:22 PST
**Test Page:** https://ign.localhost/test-accordion/
**Figma Source:** None (edit mode — no new Figma designs)

---

## Requirements

### User Requirements

**Initial phase (completed):**
- [x] Option to have just one accordion item open at a time (exclusive mode)
- [x] Option to always have at least one item open when exclusive mode is enabled (always-one-open)
- [x] Keep the accordion border outline visible when an item is open (charcoal instead of accent-lighter)
- [x] Rebuild the test page using DemoContainer wrappers with comprehensive variation coverage

**Current phase (Edit Mode - FAQ Schema):**
- [x] Add optional FAQ SEO schema (JSON-LD) output for the accordion block
- [x] Verify theme_block_props() usage is correct

### Block Type Requirements

No block type requirements documented.

---

## Block Behavior

### Exclusive Mode
When enabled, only one accordion item can be open at a time. Opening a new item automatically closes any previously open item. This option is available as a toggle in the block editor under the new "Behavior" settings panel.

### Always-One-Open
When enabled (only available when exclusive mode is also on), the accordion prevents closing the last remaining open item. At least one item must remain expanded at all times. Attempting to close the only open item leaves it open.

### Auto-Open First Item
When "always-one-open" is enabled and no items have the "open by default" option selected, the JavaScript automatically opens the first accordion item on page load to ensure the constraint is met.

### Open State Styling
When an accordion item is open:
- The background changes to accent-lighter (light gray) for visual feedback
- The border remains charcoal for definition and clarity between items
- This creates better visual separation compared to the previous behavior where both background and border changed

### Hover State Styling
When hovering over a closed accordion item:
- The background changes to accent color for hover feedback
- The border remains charcoal (consistent with resting state)
- This provides visual feedback without excessive color changes

### Editor Controls
- A new "Behavior" panel appears in the block inspector for all accordion variations
- The "Only one open at a time" toggle is always visible
- The "Always keep one open" toggle appears only when "Only one open at a time" is enabled
- The "Enable FAQ schema (SEO)" toggle is always visible in the Behavior panel

### FAQ Schema (SEO Structured Data)

When enabled, the accordion block outputs FAQPage JSON-LD structured data for search engines. This feature:

- **Question extraction:** Uses the accordion item title (summary text) as the FAQ question
- **Answer extraction:** Renders the accordion item's content blocks and extracts plain text as the answer
- **Empty item handling:** Only includes items with both a non-empty title and non-empty content in the schema
- **Format:** Follows Google's FAQPage specification with proper JSON-LD structure
- **Placement:** The JSON-LD script tag is placed immediately after the accordion section on the page
- **Encoding:** Uses wp_json_encode() with JSON_UNESCAPED_SLASHES and JSON_UNESCAPED_UNICODE flags for proper character handling
- **Default behavior:** The toggle is disabled by default (no schema output unless explicitly enabled)
- **Variation availability:** Works with both default and with-media accordion variations since the structure is identical

---

## Development Notes

### Design Decisions

**Exclusive Mode + Always-One-Open Coordination** — These two attributes work together to enforce different constraint levels:
- Exclusive mode alone allows all items closed
- Exclusive mode + always-one-open enforces at least one item open
- A processing flag prevents recursive toggle handling when items are programmatically opened/closed

**Safari Compatibility** — The `toggle` event on `<details>` elements does not bubble in Safari. Instead of event delegation, the implementation attaches individual event listeners to each accordion item. This ensures cross-browser compatibility without workarounds.

**Border Styling Rationale** — Keeping the charcoal border visible when open and on hover provides better visual separation between accordion items. The accent-lighter background color (when open) and accent background color (when hovered) still provide clear feedback about item state, but the darker outline prevents visual merging with the background and maintains consistent definition.

**Hover Border Fix** — Removed the `not-open:hover:border-accent` class to keep the border charcoal on hover instead of changing to accent. The background still changes to accent for visual feedback, but the border remains consistent.

**Auto-Open Behavior** — When `alwaysOneOpen` is enabled but no items have `openByDefault=true`, the first item automatically opens on page load. This ensures the "always one open" constraint is satisfied without requiring editors to manually set a default open item.

**Test Page Structure** — The new test page uses `takt/demo-container` blocks to wrap each variation with descriptive titles and descriptions. This follows the pattern established by other recently created test pages (test-cards-carousel, test-gallery-carousel, etc.) and provides better accessibility and structure.

### Color Mapping

- `border-charcoal` (maintained on open and hover states) — provides clear outline definition
- `bg-accent-lighter` (open state background) — light gray feedback for expanded state
- `hover:bg-accent` (hover state) — accent color for non-open items on hover
- `border-charcoal` (hover state border) — stays charcoal for consistent definition

### Implementation Notes

**Data Attributes** — The block passes `data-exclusive-mode` and `data-always-one-open` attributes to the accordion items wrapper div. The JavaScript reads these attributes to determine which behaviors to activate.

**JavaScript Processing** — An `isProcessing` flag prevents infinite loops when the JavaScript programmatically opens or closes accordion items in response to user actions.

**No Editor Preview** — The exclusive mode and always-one-open behaviors are frontend-only. The editor uses native `<details>` behavior for content editing, which is fine since the behaviors activate on the frontend display.

**BaseControl ID** — Added `id="accordion-video-url-control"` to the BaseControl component in Accordion.tsx to comply with WordPress coding guidelines for labeled form controls.

**PHP Documentation** — Added comprehensive `@var` docblocks at the top of both Accordion.php and AccordionItem.php to document all auto-extracted camelCase attribute variables and prevent PHP_CodeSniffer warnings.

**Animation Prevention for Always-One-Open** — When `alwaysOneOpen` is enabled and the user attempts to close the last remaining open item, a click event listener on the `<summary>` element now calls `event.preventDefault()` before the native toggle animation occurs. This prevents the jarring close-then-reopen animation flash. The solution listens to the click event (which fires before toggle) rather than reacting to the toggle event after the animation has started, providing a smooth user experience.

### FAQ Schema Implementation

**Schema Structure** — The JSON-LD follows Google's FAQPage specification with a context of https://schema.org, type of FAQPage, and a mainEntity array of Question objects. Each Question object contains a name (the question text) and an acceptedAnswer object with the answer text.

**Question Extraction** — Questions come from the accordion-item's title attribute. This is extracted via `$inner_block->attributes['title']` and used directly as the question name in the schema.

**Answer Extraction** — Answers are generated by rendering each accordion item's inner blocks (the content blocks: paragraphs, lists, etc.) and then stripping HTML tags with `wp_strip_all_tags()` to produce plain text. This approach:
- Preserves the actual content structure from the editor
- Removes visual formatting (bold, italic, etc.)
- Handles complex content (lists, multiple paragraphs) by joining text together
- Provides maximum compatibility with search engines

**Empty Item Handling** — Items with empty titles or empty answers are skipped entirely during schema generation. Whitespace-only answers are treated as empty. Only items with both a non-empty question AND a non-empty answer (after trimming) are included in the schema output.

**Schema Output Condition** — The PHP logic checks `if ( ! empty( $enableFaqSchema ) && ! empty( $block->inner_blocks ) )` before generating the schema. If no valid FAQ items exist (all items empty), the schema script is not output at all.

**Placement and Encoding** — The JSON-LD script tag is placed immediately after the closing `</section>` tag. This keeps the semantic HTML clean while ensuring the structured data is part of the block's output. The `wp_json_encode()` function with `JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE` flags ensures proper character encoding and minimal escaping for maximum compatibility.

---

## Issues to Address

### All Issues Resolved

All issues from previous phases have been fixed and no new issues were identified in the FAQ schema implementation.

**Previous issues (resolved):**
1. **FQA-001 (Major):** BaseControl missing id prop — Fixed by adding `id="accordion-video-url-control"` to Accordion.tsx
2. **FQA-002 (Minor):** Missing @var docblock in Accordion.php — Fixed by adding comprehensive docblock documenting all auto-extracted variables
3. **FQA-003 (Minor):** Missing @var docblock in AccordionItem.php — Fixed by adding docblock documenting all auto-extracted variables

**Current phase (FAQ Schema):**
- No issues found. Build passes, lint passes, all 10 functional QA checks passed.
- theme_block_props() usage verified as correct in both Accordion.php and AccordionItem.php

---

## Test Results

### Validation Summary

| Property | Value |
|----------|-------|
| **Last Test Type** | Functional QA (Edit Mode) |
| **Overall Status** | PASS |
| **Checks Completed** | 10 (10 passed) |
| **Issues Found** | 0 |
| **Browsers Tested** | Interactive testing on desktop (Chromium) |
| **Variations Tested** | 13 comprehensive variations including FAQ schema feature |

### Screenshots

#### Interactive Behavior Verification

| Test | Screenshot | Notes |
|------|-----------|-------|
| Hover border stays charcoal | [accordion-hover-border-test-1440w.png](screenshots/accordion-hover-border-test-1440w.png) | Closed item shows accent background on hover but border remains charcoal |
| Accordion item opens on click | [accordion-item-open-1440w.png](screenshots/accordion-item-open-1440w.png) | Clicking accordion item summary toggles the open state |
| Exclusive mode: opening Item 2 | [accordion-exclusive-mode-1440w.png](screenshots/accordion-exclusive-mode-1440w.png) | Opening new item automatically closes previously open item |
| Always-one-open constraint | [accordion-always-one-open-1440w.png](screenshots/accordion-always-one-open-1440w.png) | Last remaining open item cannot be closed |
| Auto-open first item | [auto-open-first-test-1440w.png](screenshots/auto-open-first-test-1440w.png) | First item auto-opens on page load with alwaysOneOpen enabled |
| Border styling (open state) | [accordion-border-check-1440w.png](screenshots/accordion-border-check-1440w.png) | Open item maintains charcoal border with accent-lighter background |

#### Comprehensive Test Coverage

| Breakpoint | Screenshot | Notes |
|------------|-----------|-------|
| 375px (Mobile) | [accordion-375w.png](screenshots/accordion-375w.png) | Full test page on mobile responsive width |
| 768px (Tablet) | [accordion-768w.png](screenshots/accordion-768w.png) | Full test page on tablet width |
| 1440px (Desktop) | [accordion-1440w.png](screenshots/accordion-1440w.png) | Full test page on desktop width |

### Test Cases

| Test Case | Status | Notes |
|-----------|--------|-------|
| Hover border stays charcoal | Pass | Verified - border no longer changes to accent on hover |
| Hover background changes to accent | Pass | Verified - background still provides hover feedback |
| Exclusive mode: opening item B closes item A | Pass | Verified in multiple screenshots |
| Always-one-open: last item cannot be closed | Pass | Verified — attempting to close keeps item open |
| Auto-open first item on page load | Pass | Verified when alwaysOneOpen enabled with no openByDefault items |
| Default behavior unchanged | Pass | Without exclusiveMode, multiple items can remain open simultaneously |
| Border styling: charcoal outline maintained | Pass | Open items show charcoal border, not accent-lighter |
| Background styling: accent-lighter on open | Pass | Open state background changes to accent-lighter |
| Editor controls visibility | Pass | Behavior panel shows for all variations; alwaysOneOpen toggle conditional |
| Data attributes present | Pass | All test accordion sections have correct data attributes |
| 12 test page variations | Pass | All variations wrapped in takt/demo-container blocks |
| Responsive layout on all breakpoints | Pass | Content stacks correctly on mobile and tablet |
| Long content handling | Pass | Long text wraps properly without layout breaks |
| Many items (8) layout | Pass | Multiple items maintain consistent spacing |
| Image media variation | Pass | Two-column layout with image renders correctly |
| Open by default on specific items | Pass | Items marked openByDefault start expanded |
| FAQ schema enabled toggle | Pass | ToggleControl present in Behavior panel with correct label and help text |
| FAQ schema output present | Pass | JSON-LD script tag found in page source when enableFaqSchema=true |
| FAQ schema output absent | Pass | No JSON-LD script tag when enableFaqSchema=false (default) |
| FAQ schema structure valid | Pass | JSON-LD follows Google FAQPage spec with @context, @type, mainEntity |
| Questions extracted correctly | Pass | Accordion item titles used as question names |
| Answers extracted correctly | Pass | Content rendered and plain text extracted via wp_strip_all_tags() |
| Empty items excluded | Pass | Items with empty title or content are skipped from schema |
| Multiple items in schema | Pass | Test variation with FAQ schema includes 4 valid FAQ items |
| Encoding and escaping | Pass | wp_json_encode with JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE |

### What Matched

**Functionality**
- [x] Exclusive mode prevents multiple items from being open simultaneously
- [x] Always-one-open prevents closing the last remaining open item
- [x] Auto-open first item when alwaysOneOpen enabled with no default open items
- [x] Editor toggles appear correctly with proper visibility conditions
- [x] Hover border stays charcoal (not accent) while background changes to accent
- [x] FAQ schema toggle appears in Behavior panel
- [x] FAQ schema outputs when enabled, absent when disabled

**FAQ Schema Specification**
- [x] Follows Google FAQPage schema specification
- [x] @context is https://schema.org
- [x] @type is FAQPage
- [x] mainEntity is array of Question objects
- [x] Each Question has @type, name (string), acceptedAnswer object
- [x] Each Answer has @type: Answer and text (string)
- [x] Answer text is plain text (HTML stripped)
- [x] Questions extracted from accordion item titles
- [x] Answers extracted from accordion item content blocks
- [x] Empty items (no title or content) excluded from schema
- [x] No schema output if all items empty
- [x] Proper encoding with wp_json_encode

**Styling**
- [x] Open accordion items maintain charcoal border outline
- [x] Open accordion items show accent-lighter background
- [x] Hover state shows accent background with charcoal border
- [x] TSX and PHP hover styling match exactly

**Implementation Quality**
- [x] Build passes without errors
- [x] Lint passes (all errors resolved)
- [x] TypeScript compilation clean
- [x] TSX and PHP implementations in sync
- [x] Data attributes correctly formatted in both TSX and PHP
- [x] JavaScript uses direct event listeners (Safari compatible)
- [x] Processing flag prevents recursive handling
- [x] All block attributes properly defined in block.json
- [x] BaseControl components have required id props
- [x] PHP files have proper @var docblocks
- [x] enableFaqSchema attribute in block.json, TSX, and PHP docblock
- [x] theme_block_props() usage correct in both Accordion.php and AccordionItem.php

**Test Page Coverage**
- [x] 13 comprehensive test variations all present
- [x] All variations wrapped in DemoContainer blocks
- [x] Test page follows naming convention (test-accordion)
- [x] Covers all features: default/with-media, exclusive mode, always-one-open, openByDefault, edge cases, many items, FAQ schema
- [x] FAQ schema test variation has enableFaqSchema=true with 4 valid FAQ items
- [x] Media placeholders replaced with real attachment IDs

---

## Changelog

All code changes with timestamps. Timezone: PST

| Timestamp | Change |
|-----------|--------|
| 2026-02-12 15:36 PST | Planning: Added exclusive mode, always-one-open, and border styling requirements (previous session) |
| 2026-02-12 15:43 PST | Developer: Implemented all three features; added Behavior panel with toggles; updated Accordion.js with exclusive mode and always-one-open logic (previous session) |
| 2026-02-12 15:45 PST | Functional QA: 10 checks completed, 9 passed; identified 3 issues (1 major, 2 minor) (previous session) |
| 2026-02-12 17:05 PST | Planning (current): Removed `not-open:hover:border-accent` from AccordionItem hover styling so border stays charcoal; rebuilt test page with 12 DemoContainer variations; reviewed accessibility requirements |
| 2026-02-12 17:12 PST | Developer (current): Removed hover border accent class from both AccordionItem.tsx and AccordionItem.php; created comprehensive test page with 12 variations replacing previous test pages |
| 2026-02-12 17:17 PST | Functional QA (current): Re-ran full QA suite (10 checks); verified hover border fix; confirmed all features working; identified 3 issues: 1 major (BaseControl id), 2 minor (PHP docblocks) |
| 2026-02-12 17:24 PST | Developer Fix (current): Applied all three QA fixes: added id to BaseControl, added @var docblocks to Accordion.php and AccordionItem.php; build and lint now pass |
| 2026-02-12 20:38 PST | Developer Revision: Fixed close animation flash when alwaysOneOpen prevents closing the last item. Added click event listener on summary elements with event.preventDefault() before toggle occurs. Removed redundant re-open logic from toggle listener. Smooth UX when attempting to close last open item. |
| 2026-02-13 20:09 PST | Planning (Edit Mode): Added FAQ schema feature requirement. Design decisions: place toggle in Behavior panel, use plain text answers, exclude empty items, place JSON-LD after section tag. |
| 2026-02-13 20:09 PST | Developer (Edit Mode): Implemented FAQ schema feature. Added enableFaqSchema boolean attribute to block.json. Added ToggleControl to Behavior panel in Accordion.tsx. Implemented JSON-LD FAQPage output in Accordion.php with question extraction from titles, answer extraction from inner blocks with wp_strip_all_tags(), and proper validation for empty items. Added test page variation "FAQ Schema Enabled" with enableFaqSchema=true. |
| 2026-02-13 20:18 PST | Functional QA (Edit Mode): Verified FAQ schema feature. All 10 checks passed. Confirmed JSON-LD script present when enabled, absent when disabled. Validated schema structure matches Google FAQPage spec. Verified questions/answers properly extracted. Confirmed empty items excluded. Checked TSX/PHP sync and theme_block_props() usage. No issues found. |
| 2026-02-18 PST | Replaced `rounded-lg` border-radius with `default-mask` CSS class on the media containers (image and video) in the with-media variation. The `default-mask` class uses a CSS mask for the rounded shape. Applied to both TSX and PHP. |
| 2026-02-23 PST | Updated block.json example: viewportWidth 1400→1440, added picsum posterImage URL (id/1026) for with-media variation preview. |
