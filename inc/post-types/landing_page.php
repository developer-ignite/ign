<?php

function theme_register_landing_page_post_type() {
	register_post_type('landing_page', [
		'label' => __('Landing Page', 'takt'),
		'labels' => [
			'name'                  => __('Landing Pages', 'takt'),
			'singular_name'         => __('Landing Page', 'takt'),
			'add_new'               => __('Add New', 'takt'),
			'add_new_item'          => __('Add New Landing Page', 'takt'),
			'edit_item'             => __('Edit Landing Page', 'takt'),
			'new_item'              => __('New Landing Page', 'takt'),
			'view_item'             => __('View Landing Page', 'takt'),
			'view_items'            => __('View Landing Pages', 'takt'),
			'search_items'          => __('Search Landing Pages', 'takt'),
			'not_found'             => __('No Landing Pages found', 'takt'),
			'not_found_in_trash'    => __('No Landing Pages found in Trash', 'takt'),
			'parent_item_colon'     => __('Parent Landing Page:', 'takt'),
			'all_items'             => __('All Landing Pages', 'takt'),
			'archives'              => __('Landing Page Archives', 'takt'),
			'attributes'            => __('Landing Page Attributes', 'takt'),
			'insert_into_item'      => __('Insert into Landing Page', 'takt'),
			'uploaded_to_this_item' => __('Uploaded to this Landing Page', 'takt'),
			'featured_image'        => __('Featured Image', 'takt'),
			'set_featured_image'    => __('Set featured image', 'takt'),
			'remove_featured_image' => __('Remove featured image', 'takt'),
			'use_featured_image'    => __('Use as featured image', 'takt'),
			'menu_name'             => __('Landing Pages', 'takt'),
			'filter_items_list'     => __('Filter Landing Pages list', 'takt'),
			'items_list_navigation' => __('Landing Pages list navigation', 'takt'),
			'items_list'            => __('Landing Pages list', 'takt'),
			'name_admin_bar'        => __('Landing Page', 'takt'),
		],
		'description'         => __('Landing pages with root-level URLs.', 'takt'),
		'public'              => true,
		'exclude_from_search' => false,
		'publicly_queryable'  => true,
		'show_ui'             => true,
		'show_in_nav_menus'   => true,
		'show_in_menu'        => true,
		'show_in_admin_bar'   => true,
		'menu_position'       => 20,
		'menu_icon'           => 'dashicons-text-page',
		'capability_type'     => 'page',
		'map_meta_cap'        => true,
		'hierarchical'        => true,
		'supports'            => ['title', 'editor', 'excerpt', 'thumbnail', 'page-attributes', 'revisions', 'custom-fields'],
		'taxonomies'          => [],
		'has_archive'         => false,
		'rewrite'             => [
			'slug'       => 'landing',
			'with_front' => false,
		],
		'query_var'       => true,
		'can_export'      => true,
		'delete_with_user' => null,
		'show_in_rest'    => true,
	]);
}
add_action('init', 'theme_register_landing_page_post_type');

/**
 * Strip the /landing/ prefix from permalinks so URLs are domain/slug/.
 *
 * Skipped during REST requests and on the post edit screen so the
 * Gutenberg slug editor can parse the permastruct. All other admin
 * pages (post list, admin bar, etc.) show the clean /slug/ URL.
 */
function theme_landing_page_permalink($post_link, $post) {
	if ($post->post_type !== 'landing_page') {
		return $post_link;
	}

	if (defined('REST_REQUEST') && REST_REQUEST) {
		return $post_link;
	}

	global $pagenow;
	if (is_admin() && in_array($pagenow, ['post.php', 'post-new.php'], true)) {
		return $post_link;
	}

	return home_url('/' . $post->post_name . '/');
}
add_filter('post_type_link', 'theme_landing_page_permalink', 10, 2);

/**
 * Early resolution: intercept root-level slugs before WP_Query runs.
 *
 * WordPress's page rewrite rule catches /slug/ and sets pagename=slug.
 * If no page exists with that slug, swap to landing_page query vars so
 * WP_Query finds the right post on the first try. Pages always win.
 */
function theme_landing_page_resolve_request($query_vars) {
	if (empty($query_vars['pagename']) || !empty($query_vars['post_type'])) {
		return $query_vars;
	}

	global $wpdb;

	$slug = $query_vars['pagename'];

	// If a real page exists, don't interfere
	$page_exists = $wpdb->get_var(
		$wpdb->prepare(
			"SELECT ID FROM $wpdb->posts WHERE post_name = %s AND post_type = 'page' AND post_status IN ('publish', 'private') LIMIT 1",
			$slug
		)
	);

	if ($page_exists) {
		return $query_vars;
	}

	// Check for a landing page
	$landing_id = $wpdb->get_var(
		$wpdb->prepare(
			"SELECT ID FROM $wpdb->posts WHERE post_name = %s AND post_type = 'landing_page' AND post_status IN ('publish', 'private') LIMIT 1",
			$slug
		)
	);

	if ($landing_id) {
		return [
			'post_type'    => 'landing_page',
			'landing_page' => $slug,
			'name'         => $slug,
			'p'            => (int) $landing_id,
		];
	}

	return $query_vars;
}
add_filter('request', 'theme_landing_page_resolve_request');

/**
 * Redirect /landing/slug/ to /slug/ on the frontend.
 *
 * The /landing/ prefix URL resolves via native rewrite rules. This redirect
 * ensures visitors and search engines only see the clean root-level URL.
 */
function theme_landing_page_redirect_prefix() {
	if (!is_singular('landing_page')) {
		return;
	}

	global $wp;

	if (strpos($wp->request, 'landing/') === 0) {
		global $post;
		wp_redirect(home_url('/' . $post->post_name . '/'), 301);
		exit;
	}
}
add_action('template_redirect', 'theme_landing_page_redirect_prefix');

/**
 * Resolve root-level URLs to landing pages.
 *
 * When visiting /slug/, WordPress matches the page rewrite rule and sets
 * pagename=slug. If no page exists, the query returns 0 results and is_404().
 * This hook re-queries for a landing page with that slug before the 404
 * template loads.
 */
function theme_landing_page_resolve_404() {
	if (is_admin() || !is_404()) {
		return;
	}

	global $wp;

	$path = trim($wp->request, '/');

	// Only handle root-level paths (no slashes = not a subpage/category/etc.)
	if (empty($path) || strpos($path, '/') !== false) {
		return;
	}

	global $wpdb;

	$post_id = $wpdb->get_var(
		$wpdb->prepare(
			"SELECT ID FROM $wpdb->posts WHERE post_name = %s AND post_type = 'landing_page' AND post_status = 'publish' LIMIT 1",
			$path
		)
	);

	if (!$post_id) {
		return;
	}

	global $wp_query;

	$wp_query = new WP_Query([
		'post_type' => 'landing_page',
		'p'         => (int) $post_id,
	]);

	status_header(200);
}
add_action('wp', 'theme_landing_page_resolve_404');

/**
 * Prevent landing page slugs from colliding with pages/posts.
 */
function theme_landing_page_unique_slug($slug, $post_id, $post_status, $post_type, $post_parent, $original_slug) {
	if ($post_type !== 'landing_page') {
		return $slug;
	}

	global $wpdb;

	$check_post_types = ['page', 'post'];

	foreach ($check_post_types as $check_type) {
		$existing = $wpdb->get_var(
			$wpdb->prepare(
				"SELECT ID FROM $wpdb->posts WHERE post_name = %s AND post_type = %s AND post_status IN ('publish', 'draft', 'private', 'pending') AND ID != %d LIMIT 1",
				$slug,
				$check_type,
				$post_id
			)
		);

		if ($existing) {
			$suffix = 2;
			$new_slug = $slug;

			do {
				$new_slug = "$slug-$suffix";
				$clash = false;

				foreach (['page', 'post', 'landing_page'] as $recheck_type) {
					$found = $wpdb->get_var(
						$wpdb->prepare(
							"SELECT ID FROM $wpdb->posts WHERE post_name = %s AND post_type = %s AND post_status IN ('publish', 'draft', 'private', 'pending') AND ID != %d LIMIT 1",
							$new_slug,
							$recheck_type,
							$post_id
						)
					);
					if ($found) {
						$clash = true;
						break;
					}
				}

				$suffix++;
			} while ($clash);

			return $new_slug;
		}
	}

	return $slug;
}
add_filter('wp_unique_post_slug', 'theme_landing_page_unique_slug', 10, 6);

/**
 * Prevent page slugs from colliding with landing pages.
 */
function theme_page_unique_slug_check($slug, $post_id, $post_status, $post_type, $post_parent, $original_slug) {
	if ($post_type !== 'page') {
		return $slug;
	}

	global $wpdb;

	$existing = $wpdb->get_var(
		$wpdb->prepare(
			"SELECT ID FROM $wpdb->posts WHERE post_name = %s AND post_type = 'landing_page' AND post_status IN ('publish', 'draft', 'private', 'pending') AND ID != %d LIMIT 1",
			$slug,
			$post_id
		)
	);

	if ($existing) {
		$suffix = 2;
		$new_slug = $slug;

		do {
			$new_slug = "$slug-$suffix";
			$found = $wpdb->get_var(
				$wpdb->prepare(
					"SELECT ID FROM $wpdb->posts WHERE post_name = %s AND post_type IN ('page', 'landing_page') AND post_status IN ('publish', 'draft', 'private', 'pending') AND ID != %d LIMIT 1",
					$new_slug,
					$post_id
				)
			);
			$suffix++;
		} while ($found);

		return $new_slug;
	}

	return $slug;
}
add_filter('wp_unique_post_slug', 'theme_page_unique_slug_check', 10, 6);
