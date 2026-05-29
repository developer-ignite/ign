<?php
/**
 * Register accent color post meta for pages, posts, and templates.
 */

define( 'IGN_ACCENT_COLORS', [ 'neon-green', 'blue', 'green', 'yellow', 'orange', 'purple' ] );
define( 'IGN_ACCENT_DEFAULT', 'neon-green' );

function ign_register_accent_color_meta() {
	$post_types = [ 'post', 'page', 'tribe_events', 'landing_page' ];

	foreach ( $post_types as $post_type ) {
		theme_register_post_type_meta(
			$post_type,
			[
				'accent_color' => [
					'type' => 'string',
					'default' => IGN_ACCENT_DEFAULT,
					'sanitize_callback' => 'sanitize_text_field',
				],
			]
		);
	}

	// Register for wp_template so accent color can be saved per-template in the Site Editor.
	register_post_meta(
		'wp_template',
		'accent_color',
		[
			'type'              => 'string',
			'single'            => true,
			'default'           => IGN_ACCENT_DEFAULT,
			'show_in_rest'      => true,
			'sanitize_callback' => function ( $val ) {
				return in_array( $val, IGN_ACCENT_COLORS, true ) ? $val : IGN_ACCENT_DEFAULT;
			},
			'auth_callback'     => function () {
				return current_user_can( 'edit_theme_options' );
			},
		]
	);
}
add_action( 'init', 'ign_register_accent_color_meta' );

/**
 * Expose accent_color as a top-level REST field on wp_template.
 *
 * WP_REST_Templates_Controller does not surface registered post-meta in the
 * REST response the way WP_REST_Posts_Controller does. By registering a
 * top-level REST field we allow the Site Editor (useEntityProp) to read and
 * write the value transparently.
 */
function ign_register_accent_color_rest_field() {
	register_rest_field(
		'wp_template',
		'accent_color',
		[
			'get_callback'    => function ( $template_array ) {
				$wp_id = $template_array['wp_id'] ?? 0;
				if ( ! $wp_id ) {
					return IGN_ACCENT_DEFAULT;
				}
				$val = get_post_meta( $wp_id, 'accent_color', true );
				return $val ?: IGN_ACCENT_DEFAULT;
			},
			'update_callback' => function ( $value, $template_post ) {
				$post_id = $template_post->ID ?? ( $template_post->id ?? 0 );
				if ( ! $post_id ) {
					return;
				}
				$value = in_array( $value, IGN_ACCENT_COLORS, true ) ? $value : IGN_ACCENT_DEFAULT;
				update_post_meta( $post_id, 'accent_color', $value );
			},
			'schema'          => [
				'description' => 'Accent colour class for this template.',
				'type'        => 'string',
				'enum'        => IGN_ACCENT_COLORS,
				'default'     => IGN_ACCENT_DEFAULT,
				'context'     => [ 'view', 'edit' ],
			],
		]
	);

	// Belt-and-suspenders: persist accent_color on template save even if
	// update_additional_fields_for_object() is not called.
	add_filter(
		'rest_post_dispatch',
		function ( $response, $server, $request ) {
			$method = $request->get_method();
			if ( ! in_array( $method, [ 'POST', 'PUT', 'PATCH' ], true ) ) {
				return $response;
			}

			$route = $request->get_route();
			if ( ! preg_match( '#^/wp/v2/templates/.+#', $route ) ) {
				return $response;
			}

			$accent_color = $request->get_param( 'accent_color' );
			if ( null === $accent_color ) {
				return $response;
			}

			$data  = $response->get_data();
			$wp_id = $data['wp_id'] ?? 0;
			if ( ! $wp_id ) {
				return $response;
			}

			$accent_color = in_array( $accent_color, IGN_ACCENT_COLORS, true ) ? $accent_color : IGN_ACCENT_DEFAULT;
			update_post_meta( $wp_id, 'accent_color', $accent_color );

			if ( is_array( $data ) ) {
				$data['accent_color'] = $accent_color;
				$response->set_data( $data );
			}

			return $response;
		},
		10,
		3
	);
}
add_action( 'rest_api_init', 'ign_register_accent_color_rest_field' );

/**
 * Resolve the accent color from the currently-rendering wp_template post.
 *
 * WordPress FSE sets the global $_wp_current_template_id during template
 * resolution. The value is "{theme_slug}//{template_slug}". We look up the
 * corresponding wp_template post to read its 'accent_color' meta.
 */
function ign_get_template_accent_color() {
	global $_wp_current_template_id;

	if ( ! empty( $_wp_current_template_id ) ) {
		$template = get_block_template( $_wp_current_template_id, 'wp_template' );
		if ( $template && ! empty( $template->wp_id ) ) {
			$color = get_post_meta( $template->wp_id, 'accent_color', true );
			if ( $color ) {
				return $color;
			}
		}
	}

	// Fallback: determine the template slug from the query type and try
	// multiple candidates (theme and plugin templates).
	$slugs = ign_resolve_template_slugs();
	foreach ( $slugs as $slug ) {
		// Try all registered block templates matching this slug.
		$templates = get_block_templates( [ 'slug__in' => [ $slug ] ], 'wp_template' );
		foreach ( $templates as $template ) {
			if ( ! empty( $template->wp_id ) ) {
				$color = get_post_meta( $template->wp_id, 'accent_color', true );
				if ( $color ) {
					return $color;
				}
			}
		}
	}

	return '';
}

/**
 * Determine the expected wp_template slug for the current query.
 * Returns an array of candidate slugs to try (most specific first).
 */
function ign_resolve_template_slugs() {
	$slugs = [];

	if ( is_post_type_archive() ) {
		$post_type = get_query_var( 'post_type' );
		if ( is_array( $post_type ) ) {
			$post_type = reset( $post_type );
		}
		if ( $post_type ) {
			$slugs[] = 'archive-' . $post_type;
			// The Events Calendar uses 'archive-events' instead of 'archive-tribe_events'.
			$post_type_obj = get_post_type_object( $post_type );
			if ( $post_type_obj && ! empty( $post_type_obj->rewrite['slug'] ) ) {
				$rewrite_slug = 'archive-' . $post_type_obj->rewrite['slug'];
				if ( $rewrite_slug !== 'archive-' . $post_type ) {
					$slugs[] = $rewrite_slug;
				}
			}
		}
		$slugs[] = 'archive';
	} elseif ( is_category() || is_tag() || is_tax() || is_archive() ) {
		$slugs[] = 'archive';
	} elseif ( is_search() ) {
		$slugs[] = 'search';
	} elseif ( is_404() ) {
		$slugs[] = '404';
	}

	$slugs[] = 'index';

	return $slugs;
}

function ign_accent_color_body_class( $classes ) {
	if ( is_singular( [ 'post', 'page', 'tribe_events', 'landing_page' ] ) ) {
		$accent_color = get_post_meta( get_the_ID(), 'accent_color', true );
	} else {
		$accent_color = ign_get_template_accent_color();
	}

	if ( empty( $accent_color ) ) {
		$accent_color = IGN_ACCENT_DEFAULT;
	}

	$classes[] = $accent_color;

	return $classes;
}
add_filter( 'body_class', 'ign_accent_color_body_class' );
