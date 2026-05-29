# Policy - Implementation Report

**Date:** 2026-02-09

## Overview

Created a public Policy post type with archive and single pages, plus a private Topic taxonomy exclusive to this post type.

## Files Created

- `inc/post-types/policy.php` - Post type registration
- `inc/taxonomies/policy_topic.php` - Topic taxonomy registration

## Post Type: Policy

| Setting | Value |
|---------|-------|
| Slug | `policy` |
| Visibility | Public with archive |
| URL | `/policies/{post-name}/` |
| Archive | `/policies/` |
| Menu Icon | `dashicons-clipboard` |
| Supports | title, editor, excerpt, revisions, custom-fields |

## Meta Fields

None

## Taxonomies

| Taxonomy | Slug | Visibility | Post Type |
|----------|------|------------|-----------|
| Topic | `policy_topic` | Private (admin-only) | policy |

## Optional Features

None

## Testing Instructions

1. Go to WordPress admin
2. Verify "Policies" appears in the admin menu
3. Create a new Policy
4. Verify Topic taxonomy sidebar appears in the editor
5. Verify frontend URL works at `/policies/{post-name}/`
6. Verify archive page works at `/policies/`
7. Flush permalinks: Settings > Permalinks > Save Changes
