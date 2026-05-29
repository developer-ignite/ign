<?php

// Load front-end assets.
function takt_assets() {
	$asset = include get_theme_file_path( 'public/css/screen.asset.php' );

	wp_enqueue_style(
		'takt-google-fonts',
		'https://fonts.googleapis.com/css2?family=Anton:ital@0;1&display=swap',
		[],
		null
	);

	wp_enqueue_style(
		'takt',
		get_theme_file_uri( 'public/css/screen.css' ),
		array_merge( $asset['dependencies'], [ 'takt-google-fonts' ] ),
		$asset['version']
	);

	wp_enqueue_script(
		'takt',
		get_theme_file_uri( 'public/js/screen.js' ),
		$asset['dependencies'],
		$asset['version'],
		true
	);
}
add_action( 'wp_enqueue_scripts', 'takt_assets' );

/**
 * Ensure the theme stylesheet loads after The Events Calendar.
 *
 * TEC registers its styles via tribe_asset() at priority 10.
 * This runs later to add the dependency once TEC's handle exists.
 */
function takt_assets_after_tec() {
	if ( ! wp_style_is( 'tribe-events-views-v2-full', 'enqueued' ) && ! wp_style_is( 'tribe-events-views-v2-full', 'registered' ) ) {
		return;
	}

	$style = wp_styles()->query( 'takt' );
	if ( $style && ! in_array( 'tribe-events-views-v2-full', $style->deps, true ) ) {
		$style->deps[] = 'tribe-events-views-v2-full';
	}
}
add_action( 'wp_enqueue_scripts', 'takt_assets_after_tec', 100 );

// Load editor stylesheets.
function takt_editor_styles() {
	add_editor_style( 'https://fonts.googleapis.com/css2?family=Anton:ital@0;1&display=swap' );
	add_editor_style( 'public/css/screen.css' );
}
add_action( 'after_setup_theme', 'takt_editor_styles' );

// Apply the theme's `.discourse` typography scope to the Classic (TinyMCE)
// editor body so bare h1–h6 / p / ul / ol / blockquote pick up the same
// heading/sans tokens authors see on the frontend. Gutenberg applies the
// discourse styling through its own block wrappers and is unaffected.
function takt_tinymce_discourse_body_class( $init ) {
	$existing = isset( $init['body_class'] ) ? $init['body_class'] : '';
	$init['body_class'] = trim( $existing . ' discourse' );
	return $init;
}
add_filter( 'tiny_mce_before_init', 'takt_tinymce_discourse_body_class' );

// Load editor scripts.
function takt_editor_assets() {
	$script_asset = include get_theme_file_path( 'public/js/editor.asset.php' );
	$style_asset  = include get_theme_file_path( 'public/css/editor.asset.php' );

	wp_enqueue_script(
		'takt-editor',
		get_theme_file_uri( 'public/js/editor.js' ),
		$script_asset['dependencies'],
		$script_asset['version'],
		true
	);
	wp_enqueue_style(
		'takt-editor',
		get_theme_file_uri( 'public/css/editor.css' ),
		$style_asset['dependencies'],
		$style_asset['version']
	);
}
add_action( 'enqueue_block_editor_assets', 'takt_editor_assets' );

// Load admin assets (wp-admin screens, not Gutenberg).
function takt_admin_assets() {
	$css_asset_file = get_theme_file_path( 'public/css/admin.asset.php' );
	$js_asset_file  = get_theme_file_path( 'public/js/admin.asset.php' );

	if ( file_exists( $css_asset_file ) ) {
		$css_asset = include $css_asset_file;
		wp_enqueue_style(
			'takt-admin',
			get_theme_file_uri( 'public/css/admin.css' ),
			$css_asset['dependencies'],
			$css_asset['version']
		);
	}

	if ( file_exists( $js_asset_file ) ) {
		$js_asset = include $js_asset_file;
		wp_enqueue_script(
			'takt-admin',
			get_theme_file_uri( 'public/js/admin.js' ),
			$js_asset['dependencies'],
			$js_asset['version'],
			true
		);
	}
}
add_action( 'admin_enqueue_scripts', 'takt_admin_assets' );
