# Dark Mode Pattern

Standard pattern for implementing dark mode sections with charcoal card backgrounds.

## Overview

Dark mode sections use a **transparent background** on the section with **pseudo-element charcoal cards** around content areas. This creates rounded charcoal "cards" that extend beyond the content with proper padding.

## The Pattern

### Section Level
```php
'dark bg-transparent!' => $darkMode
```

### Content Wrapper
```php
// Container padding + pseudo vertical inset = total inner charcoal padding
// py-10 (40px) + before:-inset-y-8 (32px) = 72px mobile
// md:py-15 (60px) + before:-inset-y-8 (32px) = 92px desktop
'relative py-10 md:py-15 before:absolute before:bg-charcoal before:rounded-3xl before:-z-1 before:-inset-x-(--side-gutter) before:-inset-y-8 md:before:-inset-x-(--bg-extend)' => $darkMode
```

### Classes Breakdown

| Class | Purpose |
|-------|---------|
| `dark` | Enables dark mode color scheme (white text) |
| `bg-transparent!` | Removes default dark background from section |
| `relative` | Positions wrapper for pseudo-element |
| `py-10` | 40px vertical padding on mobile |
| `md:py-15` | 60px vertical padding on desktop |
| `before:absolute` | Positions the charcoal background |
| `before:bg-charcoal` | Charcoal (#1F1F1D) background color |
| `before:rounded-3xl` | Large rounded corners on the card |
| `before:-z-1` | Places background behind content |
| `before:-inset-x-(--side-gutter)` | Horizontal: extends beyond content on mobile |
| `before:-inset-y-8` | Vertical: 32px pseudo extension beyond container |
| `md:before:-inset-x-(--bg-extend)` | Horizontal: controlled by `--bg-extend` variable (2rem default, 1rem at 768px-1168px) |

**Inner charcoal padding:** The total visible inner padding is the sum of container `py-*` and pseudo `before:-inset-y-8`. Mobile: 40 + 32 = 72px. Desktop: 60 + 32 = 92px.

## Implementation

### PHP Template

```php
<section
<?php
theme_block_props(
    class_name(
        [
            'my-block py-10 sm:py-16' => true,
            'dark bg-transparent!' => $darkMode,
        ]
    )
);
?>
>
    <div class="<?php echo class_name( [ 'container' => true, 'relative py-10 md:py-15 before:absolute before:bg-charcoal before:rounded-3xl before:-z-1 before:-inset-x-(--side-gutter) before:-inset-y-8 md:before:-inset-x-(--bg-extend)' => $darkMode ] ); ?>">
        <!-- Content goes here -->
    </div>
</section>
```

### TSX Editor Component

```tsx
<section
    { ...useBlockProps( {
        className: cn( {
            'my-block py-10 sm:py-16': true,
            'dark bg-transparent!': attributes.darkMode,
        } ),
    } ) }
>
    <div
        className={ cn( {
            container: true,
            'relative py-10 md:py-15 before:absolute before:bg-charcoal before:rounded-3xl before:-z-1 before:-inset-x-(--side-gutter) before:-inset-y-8 md:before:-inset-x-(--bg-extend)':
                attributes.darkMode,
        } ) }
    >
        {/* Content goes here */}
    </div>
</section>
```

## Examples

### CardsCarousel

Single wrapper around header and carousel:

```php
<section class="cards-carousel py-10 sm:py-16 dark bg-transparent!">
    <div class="container relative py-10 md:py-15 before:absolute before:bg-charcoal before:rounded-3xl before:-z-1 before:-inset-x-(--side-gutter) before:-inset-y-8 md:before:-inset-x-(--bg-extend)">
        <!-- ThemeHeading -->
        <!-- Carousel -->
    </div>
</section>
```

### ContentWithMedia

Separate wrappers for each content area (text and media columns):

```php
<section class="content-with-media py-10 sm:py-16 dark bg-transparent!">
    <div class="container grid grid-cols-1 md:grid-cols-2 gap-y-8!">
        <!-- Text column -->
        <div class="relative py-10 md:py-15 text-white before:absolute before:bg-charcoal before:rounded-3xl before:-z-1 before:-inset-x-(--side-gutter) before:-inset-y-8 md:before:-inset-x-(--bg-extend)">
            <!-- ThemeHeading -->
        </div>

        <!-- Media column -->
        <div class="relative py-10 md:py-15 text-white before:absolute before:bg-charcoal before:rounded-3xl before:-z-1 before:-inset-x-(--side-gutter) before:-inset-y-8 md:before:-inset-x-(--bg-extend)">
            <!-- Image/Video -->
        </div>
    </div>
</section>
```

## When to Use

Use this pattern when:
- Block needs a dark mode toggle
- Dark mode should show charcoal "card" backgrounds
- Content needs visual separation from page background

## Avoid

Do NOT use the simple pattern:
```php
// WRONG - simple full-section background
'dark bg-charcoal' => $darkMode
```

This creates a full-bleed charcoal background without the rounded card effect.

## Related

- [ContentWithMedia block](../../blocks/ContentWithMedia/)
- [CardsCarousel block](../../blocks/CardsCarousel/)
