# IGN Theme - Project Patterns

Project-specific patterns and conventions for the IGN WordPress theme.

## Patterns

| Pattern | Description |
|---------|-------------|
| [Dark Mode](patterns/dark-mode.md) | Charcoal card backgrounds with pseudo-elements |

## Quick Reference

### Badge/Status Element Positioning

When implementing badge or status elements positioned at corners of cards, use flex/absolute positioning per Figma layout flow (not literal Figma frame dimensions). If Figma shows an element in a corner via flexbox or flow layout, extract the positioning intent, not the frame pixel coordinates.

### Dark Mode Sections

Use transparent section background with pseudo-element charcoal cards:

```php
// Section
'dark bg-transparent!' => $darkMode

// Content wrapper - vertical inset MUST match section py-* padding
'relative before:absolute before:bg-charcoal before:rounded-3xl before:-z-1 before:-inset-x-(--side-gutter) before:-inset-y-gap-6 md:before:-inset-x-(--bg-extend) md:before:-inset-y-gap-8' => $darkMode
```

**Critical:** The vertical inset (`-inset-y-*`) must match the section's vertical padding (`py-*`). If section uses `py-gap-8`, use `before:-inset-y-gap-8`. This ensures the charcoal background extends to the full visual height of the section.

See [patterns/dark-mode.md](patterns/dark-mode.md) for full documentation.

## Component Preferences

### Tertiary Button Styling in Dark Mode

Tertiary button styling (`btn-tertiary`) depends on dark-mode context for correct hover states. When dark mode is applied to parent section via `dark` class, ensure button styling inherits the dark context. Never remove parent `dark` class without auditing child button hover/focus states.

### Flex Gap vs. Wrapper Margins in Header Structures

When applying margins/spacing to nested header structures with flex containers: if a flex parent uses `gap-*` to space children, do NOT add additional margins to the parent wrapper (e.g., `mt-*` on `relative flex flex-col gap-2`). Instead, apply spacing classes directly to the specific nested element that needs them (e.g., `mt-8` on the nav bar itself). Gap handles inter-child spacing; margins on the wrapper create unintended outer spacing.

### Dynamic Query Blocks - Fallback and Empty-State Behavior

Use a single generic `fallbackToLatest` attribute (not mode-specific) combined with `hideIfEmpty`. The fallback logic should work identically for both automatic and related modes, and should apply on both singular and non-singular pages. Do NOT create separate attributes like `relatedNonSingularBehavior` — instead, implement fallback in the query logic for all modes.

### Positioning Control Attributes

Boolean attributes controlling visual positioning (fixed, sticky, overlay, absolute) should use a `display*` prefix for clarity (e.g., `displayAboveContent` for overlay mode, `displayFixedOnScroll` for fixed headers). This distinguishes layout-controlling attributes from feature toggles and improves discoverability in inspector panels.

### CPT Block Image Fields

For CPT block card previews with featured images, always use `ImageDropUploader` in the block body (inline editing) and `MediaUploadPanel` in the sidebar panel (canonical location). Both read/write to the same post meta via the focal point pattern. Never use custom photo meta fields — the theme's featured image system already handles this for all post types.

### CPT Block Placeholder Text

CPT block inline editor placeholders must be plain text without trailing ellipsis or punctuation (e.g., 'First name' not 'First name...'). Placeholder text should be concise and action-oriented.

### CPT Block Dual Inline Name Fields

Dual inline RichText name fields must use `flex gap-2 flex-wrap` on the wrapper and `inline-block min-w-[6rem]` on each RichText component. This ensures the gap remains visible even when both fields are empty, and keeps both fields focusable for editing.

### Header and Navigation Structure Layout

When rebuilding header/navigation structures: verify that layout elements allowing flexible height (logo, nav bars) are siblings of height-containing elements (columns with multiple rows), not siblings of individual rows. Use `items-stretch` on flex parents to ensure all flex children match the parent's full height, especially when combining elements of different natural heights. A flex sibling can only stretch to the height of the shortest sibling in the group — if a logo needs to span two rows, it must be a flex sibling of a column containing both rows, not a sibling of individual row elements.

### Responsive flex-wrap for structural reflows

When restructuring flex layouts for desktop optimization (e.g., moving nav into columns for logo spanning), always test mobile wrapping behavior. Use `max-md:flex-wrap` on the flex parent and `max-md:w-full max-md:order-last` on child columns that should reflow to full-width rows on mobile. Desktop `gap` and `flex` classes remain inert on mobile when `max-md:` prefixes are used. This prevents mobile regressions when making structural changes to achieve desktop layout goals.

### Multi-Mode Positioning Spacing Consistency

When implementing components with multiple positioning modes (relative, fixed, absolute overlay), ensure consistent spacing across all modes. If fixed positioning includes a calculated offset (e.g., 32px via JavaScript calculation), apply that same spacing to the default relative state via CSS top padding/margin. Overlay modes should use negative margin matching the element's computed height to collapse the element's document flow impact while keeping it in the DOM. This prevents visual alignment mismatches when users toggle between positioning modes.

### Template Enforcement with Inner Blocks

For blocks with template enforcement via useEffect + replaceInnerBlocks (e.g., Footer, Header, PageLayout): compute a narrow dependency key from direct children only (string of 'name:clientId' pairs). Never subscribe to getBlocks().find() or any nested property access. This prevents race conditions when inner blocks are inserted or modified deeply within the tree.

### Logo Sizing in Headers

Use direct child selector `*:` (not `**:`) for sizing classes on SVG wrappers to avoid targeting internal SVG elements (paths, groups, etc.). Descendant selectors will apply size constraints to nested SVG internals, breaking icon rendering.

### Fixed Positioning Calculation in Header Block

When implementing sticky/fixed header behavior, account for the header's margin-top in the fixed-state threshold calculation. Subtract marginTop from the element's scrollPosition to determine when the margin area (not the element itself) reaches the viewport top. Fixed mode should activate earlier to preserve margin spacing.

## Typography Rules

- When mapping font sizes from Figma style names (H1, H2, H3) to Tailwind/theme tokens, ALWAYS verify the pixel size matches the intended visual scale in Figma. Style names are guides, not truth. Check Figma design context output for exact px values and cross-reference with headingSize attribute documentation.
- Anton font is not italic and does not have built-in styling. Never add `uppercase` or `italic` classes to Anton-based text unless explicitly shown in Figma. The font's natural slant is a design characteristic, not a CSS transform.

## Required Patterns

### Inline SVG Color Rendering

When using `theme_output_svg_or_img()` to render SVGs inline, the immediate container must have an explicit `text-white` or `text-{color}` class. Inline SVGs use `currentColor` which inherits from CSS `color` property, not from surrounding visual context. On dark backgrounds, omitting text color leaves SVG paths invisible (rendering as black text on dark background). Always pair inline SVGs with explicit text color matching the intended appearance.

Example:
```php
// WRONG - SVG invisible on dark background
<div class="flex items-center gap-2">
  <?php theme_output_svg_or_img( 'logo.svg' ); ?>
</div>

// CORRECT - SVG visible with explicit color
<div class="flex items-center gap-2 text-white">
  <?php theme_output_svg_or_img( 'logo.svg' ); ?>
</div>
```

### Tailwind Classes Not Available in Gutenberg UI Components

Tailwind utility classes are NOT processed inside Gutenberg interface-level components such as `Popover`, `InspectorControls` panels, modals, and other WordPress admin UI wrappers. These components render outside the block's iframe/scope where Tailwind is loaded. **Use inline `style` props instead** for any styling in these contexts (padding, spacing, sizing, background colors, etc.). Rely on WordPress component props for configuration (e.g., `__nextHasNoMarginBottom`, `__next40pxDefaultSize`).

Example:
```tsx
// WRONG - Tailwind classes don't work in Popover
<Popover>
  <div className="p-4 bg-gray-100 rounded-lg">...</div>
</Popover>

// CORRECT - Use inline styles or WordPress component props
<Popover>
  <div style={{ padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>...</div>
</Popover>
```

### Featured Image for CPT Blocks

Always use the focal point post thumbnail pattern via `inc/functions/featured-image.php` instead of custom photo meta fields. For CPT block editors, use `ImageDropUploader` with `image={{ id: meta._thumbnail_id || featuredMediaId || null, focalPoint: meta.focal_point }}` and `onSelect={{ featured_media, meta: { ...meta, _thumbnail_id } }}` pattern (see `resources/js/editor/featured-image.tsx` and `blocks/TeamMemberCPT/TeamMemberCPT.tsx` for examples). Do NOT register custom photo/image meta fields — `_thumbnail_id` and `focal_point` are already registered globally for all post types.

### CSS Cascade Layers for Focus Styles

When adding focus-visible or outline overrides to components, check if a global `*:focus-visible` rule exists in `body.css` or other base stylesheets. If found, ensure it is wrapped in `@layer base` (or the same `@layer` as your override). Unlayered global rules always beat `@layer` rules regardless of specificity. Use `taktician_screenshot` with keyboard actions to verify focus styling works on rendered pages. This prevents silent failures where CSS utilities appear correct in code but fail at runtime due to cascade layer precedence.

### RichText Content Escaping

RichText editor content (with potential HTML tags like `<br>`, `<strong>`, `<em>`, etc.) must use `wp_kses_post()` for output, never `esc_html()`. Use `esc_html()` only for plain text fields (text inputs, simple metadata without HTML support). RichText saves HTML markup that should be preserved on the frontend; escaping it as HTML-safe text will display literal tags instead of rendering them.

## Accessibility Requirements

- All images require alt text, no exceptions
- Focus states must be visible with clear contrast
- **Focus-visible states must match hover state styling.** When adding `hover:class` to an element, also add `focus-visible:class` with identical styling. This ensures keyboard users see the same visual feedback as mouse users.
- **Keyboard navigation MUST be tested live in a browser.** Do not verify keyboard behavior by code review alone. Use `taktician_screenshot` with keyboard actions (e.g., `press("Tab")`, `press("Enter")`, `press("ArrowRight")`) to test every keyboard-navigable element (menubar, tabs, accordion, dropdown, dialog). Code can look correct but still fail in browsers (e.g., `.focus()` on non-focusable elements without `tabindex`). Live testing catches these failures.

## Learnings

Project-specific rules discovered during revision cycles. Auto-maintained by the Learning Agent.

<!-- Entries are appended here automatically after user-initiated revisions -->

### Dark mode contrast for shared components (Archive, 2026-02-10)

When a block uses the `dark` class pattern, verify that all shared/global CSS components rendered inside the section (pagination, form elements, WordPress core output) have explicit `dark:` overrides in their stylesheets. Check `navigation.css`, `forms.css`, and any other global component CSS for missing dark mode variants.

### Live keyboard testing for all keyboard-navigable components (Header, 2026-02-18)

Keyboard navigation behavior must be tested in a live browser using `taktician_screenshot` with keyboard actions, not via code review. Previous revision marked keyboard fixes as passing after code review, but live testing revealed that `[role=menuitem]` selectors targeting li elements without tabindex fail silent `.focus()` calls. The selector looked correct in code but didn't work in the browser. Always test with actual keystrokes in a rendered page.