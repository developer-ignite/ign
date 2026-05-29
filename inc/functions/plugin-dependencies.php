<?php

/**
 * Theme Plugin Dependencies
 *
 * Uses WP Dependencies Manager to prompt users to install
 * required and recommended plugins.
 *
 * Plugin zip files are stored in the theme's /plugins folder.
 * Plugins hosted on wp.org use the "wordpress" host instead.
 *
 * @link https://github.com/LAPSrj/wp-dependencies-manager
 */

function takt_register_plugin_dependencies() {
	if ( ! class_exists( 'WP_Dependencies_Manager' ) ) {
		return;
	}

	$config = [
		[
			'name' => 'Alt Text AI',
			'host' => 'wordpress',
			'slug' => 'alttext-ai/atai.php',
			'uri'  => 'https://wordpress.org/plugins/alttext-ai/',
		],
		[
			'name' => 'Duplicate Page',
			'host' => 'wordpress',
			'slug' => 'duplicate-page/duplicatepage.php',
			'uri'  => 'https://wordpress.org/plugins/duplicate-page/',
		],
		[
			'name' => 'FileBird',
			'host' => 'wordpress',
			'slug' => 'filebird/filebird.php',
			'uri'  => 'https://wordpress.org/plugins/filebird/',
		],
		[
			'name' => 'Gravity Forms',
			'host' => 'local',
			'slug' => 'gravityforms/gravityforms.php',
			'uri'  => 'plugins/gravityforms_2.9.28.zip',
		],
		[
			'name' => 'Gravity Forms reCAPTCHA',
			'host' => 'local',
			'slug' => 'gravityformsrecaptcha/recaptcha.php',
			'uri'  => 'plugins/gravityformsrecaptcha_2.1.0.zip',
		],
		[
			'name' => 'Insert Headers And Footers',
			'host' => 'wordpress',
			'slug' => 'wp-headers-and-footers/wp-headers-and-footers.php',
			'uri'  => 'https://wordpress.org/plugins/wp-headers-and-footers/',
		],
		[
			'name' => 'Redirection',
			'host' => 'wordpress',
			'slug' => 'redirection/redirection.php',
			'uri'  => 'https://wordpress.org/plugins/redirection/',
		],
		[
			'name' => 'Safe SVG',
			'host' => 'wordpress',
			'slug' => 'safe-svg/safe-svg.php',
			'uri'  => 'https://wordpress.org/plugins/safe-svg/',
		],
		[
			'name' => 'Simple History',
			'host' => 'wordpress',
			'slug' => 'simple-history/index.php',
			'uri'  => 'https://wordpress.org/plugins/simple-history/',
		],
		[
			'name' => 'The Events Calendar',
			'host' => 'wordpress',
			'slug' => 'the-events-calendar/the-events-calendar.php',
			'uri'  => 'https://wordpress.org/plugins/the-events-calendar/',
		],
	];

	WP_Dependencies_Manager::instance( get_theme_file_path() )
		->register( $config )
		->run();
}
add_action( 'after_setup_theme', 'takt_register_plugin_dependencies' );

function takt_dependency_dismiss_label( $label, $source ) {
	if ( get_option( 'stylesheet' ) === $source ) {
		$label = __( 'Theme Warning', 'ign' );
	}
	return $label;
}
add_filter( 'wp_dependency_dismiss_label', 'takt_dependency_dismiss_label', 10, 2 );
