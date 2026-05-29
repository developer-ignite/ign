<?php


// Dynamically reorder admin menu items by URL
function theme_dynamic_reorder_admin_menu_by_url() {
	global $menu;

	$items_to_move = [
		[
			'match_url' => 'upload.php',
			'new_key'   => '58',
		],
		[
			'match_url' => 'edit.php?post_type=page',
			'new_key'   => '4.9',
		],
	];

	$moved_items = [];

	foreach ( $menu as $key => $item ) {
		if ( isset( $item[2] ) ) { // [2] is the URL
			foreach ( $items_to_move as $move ) {
				if ( $item[2] === $move['match_url'] ) {
					$moved_items[ $move['new_key'] ] = $item;
					unset( $menu[ $key ] );
				}
			}
		}
	}

	foreach ( $moved_items as $position => $item ) {
		$menu[ $position ] = $item;
	}
}
add_action( 'admin_menu', 'theme_dynamic_reorder_admin_menu_by_url', 999 );


/**
 * Define plugin pages to be moved or aliased under new menus.
 *
 * @param array $items List of existing moves.
 * @return array Extended list with our custom moves.
 */
function theme_define_movable_menu_items( $items ) {
	$items[] = array(
		'original_slug' => 'admin.php?page=filebird-settings',
		'new_parent'    => 'options-general.php',
		'new_label'     => __( 'FileBird', 'takt' ),
	);

	$items[] = array(
		'original_slug' => 'admin.php?page=atai',
		'new_parent'    => 'options-general.php',
		'new_label'     => __( 'AltText.ai', 'takt' ),
	);

	$items[] = array(
		'original_slug' => 'admin.php?page=atai-csv-import',
		'new_parent'    => 'tools.php',
		'new_label'     => __( 'AltText.ai Sync Library', 'takt' ),
	);

	return $items;
}

/**
 * Move registered plugin menu items into their new locations.
 *
 * @return void
 */
function theme_move_plugin_menu_items() {
	$items = apply_filters( 'theme_movable_menu_items', array() );

	foreach ( $items as $item ) {
		if ( ! empty( $item['original_slug'] ) && ! empty( $item['new_parent'] ) && ! empty( $item['new_label'] ) ) {
			theme_move_menu_item(
				$item['original_slug'],
				$item['new_parent'],
				$item['new_label']
			);
		}
	}
}

/**
 * Move a plugin menu item or create an alias if already nested.
 *
 * @param string $old_slug Original slug (can be full "admin.php?page=x" or just "x").
 * @param string $new_parent_slug Target menu (e.g., options-general.php or tools.php).
 * @param string $new_submenu_title Label to appear in new location.
 * @return void
 */
function theme_move_menu_item( $old_slug, $new_parent_slug, $new_submenu_title ) {
	global $menu, $submenu;

	$menu_item = null;
	$normalized_old_slug = theme_normalize_slug( $old_slug );

	// Check if it's already a submenu
	$is_top_level = true;
	foreach ( $submenu as $parent => $subs ) {
		foreach ( $subs as $sub ) {
			if ( theme_normalize_slug( $sub[2] ) === $normalized_old_slug ) {
				$is_top_level = false;
				break 2;
			}
		}
	}

	// Only unset if it's a top-level menu
	if ( $is_top_level ) {
		foreach ( $menu as $index => $item ) {
			if ( isset( $item[2] ) && theme_normalize_slug( $item[2] ) === $normalized_old_slug ) {
				$menu_item = $item;
				unset( $menu[ $index ] );
				break;
			}
		}
	}

	// If it's not top-level or we're linking from tools.php, add an alias
	if ( ! $is_top_level || $new_parent_slug === 'tools.php' ) {
		add_submenu_page(
			$new_parent_slug,
			isset( $menu_item[0] ) ? $menu_item[0] : $new_submenu_title, // Page title
			$new_submenu_title,                                        // Menu label
			'manage_options',                                          // Capability
			'admin.php?page=' . $normalized_old_slug                   // Redirect URL
		);
		return;
	}

	if ( $menu_item !== null ) {
		$hook_name = get_plugin_page_hookname( $normalized_old_slug, 'admin.php' );
		$callback = null;

		if ( has_action( $hook_name ) ) {
			$callback = theme_find_callback_for_hook( $hook_name );
		}

		add_submenu_page(
			$new_parent_slug,
			$menu_item[0],               // Page title
			$new_submenu_title,          // Menu label
			$menu_item[1],               // Capability
			$normalized_old_slug,        // Slug
			$callback ?? ''              // Callback
		);
	}
}

/**
 * Retrieve the callback function associated with a plugin menu hook.
 *
 * @param string $hook_name The hook name used by WordPress.
 * @return callable|null The registered callback function or null.
 */
function theme_find_callback_for_hook( $hook_name ) {
	global $wp_filter;

	if ( isset( $wp_filter[ $hook_name ] ) ) {
		$hook = $wp_filter[ $hook_name ];

		if ( is_object( $hook ) && isset( $hook->callbacks ) ) {
			foreach ( $hook->callbacks as $priority => $functions ) {
				foreach ( $functions as $function ) {
					if ( isset( $function['function'] ) ) {
						return $function['function'];
					}
				}
			}
		}
	}

	return null;
}

/**
 * Normalize a slug to just the "page" part if it starts with "admin.php?page=".
 *
 * @param string $slug Menu slug, possibly including admin.php prefix.
 * @return string Normalized slug.
 */
function theme_normalize_slug( $slug ) {
	if ( strpos( $slug, 'admin.php?page=' ) === 0 ) {
		return substr( $slug, strlen( 'admin.php?page=' ) );
	}
	return $slug;
}

/**
 * Remove declared top-level menus that were moved.
 *
 * @return void
 */
function theme_remove_unwanted_top_menus() {
	global $menu;

	$remove_slugs = apply_filters( 'theme_movable_top_level_slugs', array() );

	foreach ( $menu as $index => $item ) {
		if ( isset( $item[2] ) ) {
			$normalized_slug = theme_normalize_slug( $item[2] );
			if ( in_array( $normalized_slug, $remove_slugs, true ) ) {
				unset( $menu[ $index ] );
			}
		}
	}
}

/**
 * Dynamically remove top-level slugs that were moved to other parents.
 *
 * @param array $slugs Existing slugs to remove.
 * @return array New list of top-level slugs that should be removed.
 */
function theme_define_removed_top_menus( $slugs ) {
	$items = apply_filters( 'theme_movable_menu_items', array() );

	foreach ( $items as $item ) {
		$normalized_slug = theme_normalize_slug( $item['original_slug'] );
		$slugs[] = $normalized_slug;
	}

	return array_unique( $slugs );
}


add_action( 'admin_menu', 'theme_move_plugin_menu_items', 100 );
add_action( 'admin_menu', 'theme_remove_unwanted_top_menus', 999 );
add_filter( 'theme_movable_menu_items', 'theme_define_movable_menu_items' );
add_filter( 'theme_movable_top_level_slugs', 'theme_define_removed_top_menus' );
