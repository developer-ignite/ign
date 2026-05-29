# Block Report: Search

**Date:** 2026-02-12 22:16 PST
**Test Page:** https://ign.localhost/test-search/
**Figma Source:**
- [Desktop](https://www.figma.com/design/bpRK9A1l2nTbWfMg1pX5yK/IGN-%7C-WEBSITE--INTERNAL-?node-id=678-33982&m=dev)

## Requirements

### User Requirements

- [ ] Site-wide search functionality querying all public post types
- [ ] Post type filter dropdown showing all searchable public post types
- [ ] Search bar on its own row, separate from filter controls
- [ ] Filter-by and Show N Per Page controls on a separate line below search
- [ ] Keyword search with AJAX submission
- [ ] Pagination or Load More toggle option
- [ ] Configurable posts per page (default 9)
- [ ] Editable block title (heading) and search placeholder
- [ ] Display filter and per-page selector can be toggled independently
- [ ] Single-column card layout (1 post per line)
- [ ] Post type pill with dynamic accent colors
- [ ] Post title displayed below post type pill
- [ ] Post excerpt below title
- [ ] Learn More button with arrow icon
- [ ] No breadcrumbs on result cards
- [ ] Centered pagination and Learn More buttons
- [ ] Responsive behavior across all breakpoints

### Block Type Requirements

No block type requirements documented.

## Block Behavior

User-facing description of what the Search block does in layman's terms.

### Layout and Structure

- Single-column search interface at the top of the block with an editable heading ("Search Results" by default)
- Search bar on its own dedicated row with a text input field and Search button
- Filter controls on a separate row below the search bar, including:
  - Post type filter dropdown on the left
  - Show N Per Page selector on the right (with "Show" and "Per Page" labels)
  - Clear All button visible only when filters are active
- Results display in a single-column grid below the filters
- Results count displayed above results ("1-9 OF OVER 36 RESULTS")
- Pagination or Load More button centered below results (configurable per block)

### Search Functionality

- Search input accepts keyword queries and can be submitted via the Search button or Enter key
- Filters update results via AJAX without full page reload
- All form changes (search, filter selection, per-page change, pagination) update the browser URL
- Browser back/forward buttons work correctly with saved filter state
- Loading spinner displays during AJAX requests

### Result Cards

Each search result displays as a full-width clickable card containing:
- Post type pill at the top (using the page's accent color, dynamically adjusting per page settings)
- Post title below the pill
- Post excerpt below the title
- "Learn More" button with arrow icon at the bottom
- Entire card is clickable as a link to the post
- Card border appears on hover/focus for interactive feedback

### Filter Behavior

- Filter by Post Type dropdown shows all public, searchable post types from the site
- Users can select one or multiple post types to filter results
- Active filters display as removable pills below the filter row
- Clear All button removes all active filters at once
- Per-page dropdown allows users to change how many results display per page (options based on the default posts per page setting)

### Pagination Modes

**Pagination Mode (Default):**
- Numbered pagination (1, 2, 3, etc.) displays centered below results
- Shows current page and total pages
- Unique feature: gradient progress bar below pagination numbers indicates progress through results (green to blue gradient)
- Progress bar fills proportionally as user navigates pages

**Load More Mode:**
- "Load More" button displays centered below results instead of numbered pagination
- Clicking appends additional results without replacing existing ones
- Button shows loading state while fetching more results

### Responsive Behavior

- Mobile (under 768px): All elements stack vertically; search input, dropdowns, and buttons each take full width; heading wraps; pagination numbers simplify
- Tablet (768px-1023px): Search input and button share a row; filter dropdown and per-page selector share a row; single-column cards continue
- Desktop (1024px+): Full layout as designed with optimal spacing and alignment

### Conditional Elements

- Filter row can be hidden entirely via block settings (displayFilters toggle)
- Per-page selector can be hidden independently (displayPerPage toggle)
- When no filters are active, the "Clear All" button and active filter pills remain hidden
- When no results found, a "No results found" message displays

## Development Notes

### Design Decisions

- **Separate rows for search and filters:** Spec override from Figma to improve UX. Figma showed search + filter-by on same row, but spec required search bar on own row for better mobile responsiveness and visual separation.
- **Dynamic post type filters:** Block queries all public, searchable post types dynamically via `get_post_types()` rather than static configuration. This allows the filter dropdown to stay current if new post types are added.
- **Post type pill color tokens:** Uses `bg-accent-lighter` and `border-accent-light` tokens instead of hardcoded colors. This enables per-page accent customization while Figma shows a fixed teal color.
- **No per-post-type variations:** Unlike Archive block, Search block is a single block that searches all types. Variations controlled via filters and settings, not block variations.
- **Title field addition:** Post title not shown in Figma but required per spec. Displayed below post type pill for clarity.
- **Gradient progress bar:** Unique visual element showing pagination progress. Green-to-blue gradient (`neon-green` to `blue` theme tokens) fills proportionally with current page position.
- **CSS custom properties for progress:** Progress bar width and styling moved from inline styles to CSS custom property (`--progress`) for cleaner, more maintainable code.

### Color Mapping

| Element | Figma Value | Theme Token | Status |
|---------|-------------|-------------|--------|
| Page background | Off-white | `bg-off-white` (page default) | Exact |
| Heading text | #1f1f1d | `text-charcoal` | Exact |
| Card border | 1px solid #1f1f1d | `border border-charcoal` | Exact |
| Card border-radius | 25px | `rounded-3xl` (24px) | Acceptable (1px difference) |
| Card padding | 24px | `p-6` (24px) | Exact |
| Post type pill background | #b2eae7 | `bg-accent-lighter` (dynamic) | Acceptable (spec override: dynamic per page accent) |
| Post type pill border | 1px solid #00b8b0 | `border-accent-light` (dynamic) | Acceptable (spec override: dynamic per page accent) |
| Search input background | #ffffff | `bg-white` | Exact |
| Pagination progress fill | gradient #b8ff34 → #47cbf2 | `linear-gradient(90deg, var(--color-neon-green), var(--color-blue))` | Exact |
| Pagination progress track | rgba(31,31,29,0.5) | `bg-charcoal/50` | Exact |

### Deviations from Design

- **Search bar placement:** Figma shows search + filter-by on same row; spec override places search on its own row
- **Show Per Page location:** Figma places at bottom with pagination; spec override places on filter row with other controls
- **Post title:** Not shown in Figma design; added per spec requirement
- **No breadcrumbs:** Figma shows breadcrumbs on cards; spec override requires omission
- **Dynamic accent colors:** Figma shows fixed teal (#b2eae7); implementation uses dynamic accent tokens per spec requirement

## Issues to Address

None. All 3 issues identified in Functional QA have been resolved via Developer Fix cycle.

## Test Results

### Validation Summary

| Property | Value |
|----------|-------|
| **Last Test Type** | Full |
| **Overall Match** | Excellent |
| **Breakpoints Tested** | 375px, 768px, 1024px, 1440px |
| **Browsers Tested** | Chromium, Firefox, WebKit |
| **Variations Tested** | 5 (Default Pagination, Load More, Minimal, Custom, Filters Only) |
| **Status** | Complete with fixes applied |

### Screenshots

#### Full Validation (All Browsers)

| Breakpoint | Chromium | Firefox | WebKit |
|------------|----------|---------|--------|
| 375px | [view](screenshots/search-chromium-375w.png) | [view](screenshots/search-firefox-375w.png) | [view](screenshots/search-webkit-375w.png) |
| 768px | [view](screenshots/search-chromium-768w.png) | [view](screenshots/search-firefox-768w.png) | [view](screenshots/search-webkit-768w.png) |
| 1024px | [view](screenshots/search-chromium-1024w.png) | [view](screenshots/search-firefox-1024w.png) | [view](screenshots/search-webkit-1024w.png) |
| 1440px | [view](screenshots/search-chromium-1440w.png) | [view](screenshots/search-firefox-1440w.png) | [view](screenshots/search-webkit-1440w.png) |

#### Additional Reference Screenshots

| Purpose | Screenshot |
|---------|-----------|
| Search form interaction | [view](screenshots/search-form-interaction-1440w.png) |
| Filter select dropdown | [view](screenshots/search-filter-select-1440w.png) |
| Card detail view | [view](screenshots/search-detail-1440w.png) |
| Pagination interaction | [view](screenshots/search-pagination-1440w.png) |

### Test Cases

| Test Case | Status | Notes |
|-----------|--------|-------|
| Default - Pagination mode with all features | Pass | Heading, search bar, filter dropdown, per-page selector, result cards, numbered pagination with progress bar all render correctly |
| Load More mode | Pass | Same layout with "Load More" button instead of numbered pagination |
| Minimal - No filters, no per-page | Pass | Only search bar and results visible; conditional rendering works correctly |
| Custom heading and placeholder | Pass | Editable attributes render with custom text; postsPerPage=6 shows 6 results correctly |
| Filters only, no per-page | Pass | Filter dropdown visible but per-page selector hidden; independent toggle behavior verified |
| Search form submission | Pass | AJAX submission works; loading spinner displays; URL updates with search parameter |
| Post type filter selection | Pass | Results filter to selected type; active filter pill appears; URL updates |
| Clear all filters | Pass | All active filters removed; results display all post types; pills disappear |
| Pagination navigation | Pass | Page navigation works; progress bar advances; results update via AJAX |
| Per-page selector change | Pass | Results refresh with new count; results count text updates; pagination adjusts |
| Responsive at all breakpoints | Pass | Layout stacks appropriately on mobile; maintains structure at tablet/desktop |
| Cross-browser consistency | Pass | All three browsers (Chromium, Firefox, WebKit) render consistently at all breakpoints |

### What Matched

**Layout**
- [x] Single-column result card layout (1 post per line)
- [x] Search bar centered and full-width on its own row
- [x] Filter row below search with Post Type dropdown and Show N Per Page on right
- [x] Results centered with proper spacing
- [x] Pagination/Load More button centered

**Typography**
- [x] Heading uses Anton Regular at 64px (text-header-1)
- [x] Result card titles use header-5 size
- [x] Excerpt text uses body text size with medium weight
- [x] Button text properly uppercased with correct sizing

**Colors**
- [x] Page background is off-white
- [x] Text is charcoal (#1f1f1d)
- [x] Card borders use charcoal
- [x] Post type pills use dynamic accent colors
- [x] Pagination progress gradient (green to blue) matches Figma specification

**Components**
- [x] Search input has pill shape (rounded-full) with white background
- [x] Buttons have correct styling and hover states
- [x] Filter dropdown has pill shape
- [x] Cards have rounded corners matching specification
- [x] Active filter pills display with remove icon

**Spec Overrides Verified**
- [x] Search bar on its own row (different from Figma)
- [x] Filter-by filters by post type (not taxonomy)
- [x] Show N Per Page on filter row (different from Figma)
- [x] No breadcrumbs on cards
- [x] Post title displayed below post type pill
- [x] Excerpt displays below title
- [x] Learn More button below excerpt
- [x] Pagination and Load More centered

## Changelog

| Timestamp | Change |
|-----------|--------|
| 2026-02-12 21:06 PST | Planning complete: Block specification, attributes, styling, behavior, accessibility requirements documented |
| 2026-02-12 21:06 PST | Developer implementation: Block files created (Search.tsx, Search.php, Search.js, Search.css), supporting files (card-search.php, resources), query var registration |
| 2026-02-12 22:08 PST | Functional QA: 11 checks run, 9 passed, 2 failed. Issues found: missing ARIA attributes (major), missing PHP docblock (minor), inline styles on progress bar (minor) |
| 2026-02-12 22:06 PST | Design QA: Full validation complete across all 4 breakpoints and 3 browsers. Overall match: Excellent. All spec overrides verified. All 5 test variations pass. |
| 2026-02-12 22:15 PST | Developer fixes applied: Added @var docblock to PHP template, added aria-disabled and aria-busy to Load More button, refactored progress bar to use CSS custom properties |
| 2026-02-18 PST | Tertiary button arrow style update: Arrow now animates 12px right on hover/focus via margin transition (pre-reserved with `margin-right: 0.75rem`, transitions to `margin-left: 0.75rem; margin-right: 0`). Hover underline removed. Arrow wrapper class changed from inline Tailwind utilities to `btn-tertiary-arrow` CSS class. Animation handled globally in `resources/css/screen/button.css`. |
| 2026-02-23 PST | Updated block.json example: viewportWidth 1400→1440 to match standard section preview width. |
