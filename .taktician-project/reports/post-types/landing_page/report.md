# Landing Page - Implementation Report

**Date:** 2026-02-20

## Overview

Created a "Landing Page" custom post type that mirrors the default WordPress page post type behavior (hierarchical, page-attributes, thumbnail support) with root-level URLs (`domain/slug/`) that don't break existing permalinks.

## Files Created

- `inc/post-types/landing_page.php` - Post type registration with root-level URL rewrite

## Post Type: Landing Page

| Setting | Value |
|---------|-------|
| Slug | `landing_page` |
| Visibility | Public |
| URL | `/{post-name}/` (root-level, no prefix) |
| Archive | No |
| Menu Icon | `dashicons-text-page` |
| Supports | title, editor, excerpt, thumbnail, page-attributes, revisions, custom-fields |
| Hierarchical | Yes (like pages) |
| Capability Type | `page` |

## Root-Level URL Strategy

The landing page URLs work at the root level (`domain/slug/`) without breaking other permalinks using three mechanisms:

1. **`rewrite => false`** - Prevents WordPress from auto-generating rewrite rules with a prefix
2. **`add_rewrite_rule()` with `'bottom'` priority** - Adds a catch-all rule at the lowest priority, so all other rewrite rules (pages, posts, categories, archives, etc.) are checked first. Only unmatched slugs fall through to the landing page rule.
3. **`post_type_link` filter** - Generates the correct root-level permalink (`domain/slug/`) in admin and frontend links

## Meta Fields

None.

## Taxonomies

None.

## Testing Instructions

1. Go to WordPress admin
2. Verify "Landing Pages" appears in the admin menu
3. Create a new Landing Page with a slug (e.g., "promo")
4. **Flush permalinks**: Go to Settings > Permalinks and click "Save Changes"
5. Verify the Landing Page is accessible at `domain/promo/`
6. Verify existing pages still work at their URLs
7. Verify existing posts still work at their URLs
8. Verify the Landing Page permalink in the editor shows the root-level URL

**Important:** After activation, you must flush permalinks (Settings > Permalinks > Save Changes) for the rewrite rules to take effect.
