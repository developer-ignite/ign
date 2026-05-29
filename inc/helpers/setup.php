<?php

require_once __DIR__ . '/rewrite.php';
require_once __DIR__ . '/assets.php';
require_once __DIR__ . '/classname.php';
require_once __DIR__ . '/image-position.php';
require_once __DIR__ . '/image-svg.php';
require_once __DIR__ . '/blocks.php';
require_once __DIR__ . '/post-type-meta.php';

foreach ( glob( __DIR__ . '/../post-types/*.php' ) as $cpt_file ) {
	require_once $cpt_file;
}

foreach ( glob( __DIR__ . '/../taxonomies/*.php' ) as $tax_file ) {
	require_once $tax_file;
}

foreach ( glob( __DIR__ . '/../functions/*.php' ) as $function_file ) {
	require_once $function_file;
}

function takt_load_textdomain() {
	load_theme_textdomain( 'takt', get_template_directory() . '/assets/languages' );
}
add_action( 'after_setup_theme', 'takt_load_textdomain' );

function takt_theme_supports() {
	add_theme_support( 'title-tag' );
}
add_action( 'after_setup_theme', 'takt_theme_supports' );
