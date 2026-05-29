<?php
/**
 * "Hide on Search" page meta — exclude a Page from on-site search results
 * AND tell search engines not to index it. Used for transactional /
 * confirmation pages (Thank You, Submitted) that should only be reached via
 * the workflow that redirects there.
 *
 * Surface: editor sidebar panel rendered by resources/js/editor/hide-on-search.tsx
 * Storage: post meta `_takt_hide_on_search` (boolean, single, in REST).
 * Behavior:
 *   - On-site search: a `pre_get_posts` filter excludes pages with the meta
 *     set, on frontend search queries.
 *   - Search engines: a `wp_head` action emits a `<meta name="robots"
 *     content="noindex, nofollow">` tag on those pages when AIOSEO isn't
 *     handling robots, plus an AIOSEO filter that forces noindex/nofollow
 *     when AIOSEO is the source of robots meta.
 *   - Sitemaps: a hook excludes the post from the AIOSEO XML sitemap.
 */

const TAKT_HIDE_ON_SEARCH_META_KEY = '_takt_hide_on_search';

/**
 * Register the meta. Underscore-prefixed key needs an auth_callback so it
 * shows up in REST.
 */
function takt_register_hide_on_search_meta() {
	$post_types = [ 'page' ];

	foreach ( $post_types as $post_type ) {
		register_post_meta(
			$post_type,
			TAKT_HIDE_ON_SEARCH_META_KEY,
			[
				'type'              => 'boolean',
				'single'            => true,
				'default'           => false,
				'show_in_rest'      => true,
				'sanitize_callback' => 'rest_sanitize_boolean',
				'auth_callback'     => function () {
					return current_user_can( 'edit_pages' );
				},
			]
		);
	}
}
add_action( 'init', 'takt_register_hide_on_search_meta' );

/**
 * Exclude flagged pages from on-site search.
 *
 * Runs on every frontend WP_Query for `is_search()` — including the main
 * query (`/?s=…`) and any secondary `new WP_Query` the Search block builds
 * with an `s` arg. Skipping the main-query check is intentional: the Search
 * block does its own query and would otherwise bypass the filter.
 *
 * Adds a `meta_query` clause that omits posts where the flag is truthy.
 * The NOT EXISTS branch keeps posts that have never had the meta written
 * (so we don't accidentally suppress the entire pre-existing corpus).
 */
function takt_filter_search_query_hide_on_search( $query ) {
	if ( is_admin() || ! $query->is_search() ) {
		return;
	}

	$existing = $query->get( 'meta_query' );
	$meta_query = is_array( $existing ) ? $existing : [];

	$meta_query[] = [
		'relation' => 'OR',
		[
			'key'     => TAKT_HIDE_ON_SEARCH_META_KEY,
			'compare' => 'NOT EXISTS',
		],
		[
			'key'     => TAKT_HIDE_ON_SEARCH_META_KEY,
			'value'   => '1',
			'compare' => '!=',
		],
	];

	$query->set( 'meta_query', $meta_query );
}
add_action( 'pre_get_posts', 'takt_filter_search_query_hide_on_search' );

/**
 * Emit a noindex/nofollow robots tag on flagged pages.
 *
 * Always fires (regardless of which SEO plugin is active). When AIOSEO or
 * Yoast also emit a robots tag, search engines honor the most restrictive
 * directive across the duplicates — so a permissive third-party tag does
 * not override our noindex.
 */
function takt_hide_on_search_emit_robots() {
	if ( ! is_singular( 'page' ) ) {
		return;
	}
	if ( ! get_post_meta( get_the_ID(), TAKT_HIDE_ON_SEARCH_META_KEY, true ) ) {
		return;
	}
	echo '<meta name="robots" content="noindex, nofollow" />' . "\n";
}
add_action( 'wp_head', 'takt_hide_on_search_emit_robots', 1 );

/**
 * Exclude flagged pages from the AIOSEO XML sitemap so they don't get
 * surfaced to crawlers via that route either.
 */
function takt_hide_on_search_exclude_from_sitemap( $excluded_ids ) {
	$flagged = get_posts(
		[
			'post_type'      => 'page',
			'post_status'    => 'publish',
			'posts_per_page' => -1,
			'fields'         => 'ids',
			'meta_key'       => TAKT_HIDE_ON_SEARCH_META_KEY,
			'meta_value'     => '1',
			'no_found_rows'  => true,
		]
	);

	if ( ! is_array( $excluded_ids ) ) {
		$excluded_ids = [];
	}

	return array_values( array_unique( array_merge( $excluded_ids, $flagged ) ) );
}
add_filter( 'aioseo_sitemap_exclude_posts', 'takt_hide_on_search_exclude_from_sitemap' );
