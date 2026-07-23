<?php

function theme_image_position( $focal_point ) {
	if ( ! is_array( $focal_point ) ) {
		return 'center center';
	}
	$x = isset( $focal_point['x'] ) ? floatval( $focal_point['x'] ) * 100 : 50;
	$y = isset( $focal_point['y'] ) ? floatval( $focal_point['y'] ) * 100 : 50;
	return esc_attr( "{$x}% {$y}%" );
}

/**
 * Resolve a per-breakpoint image attribute (desktop/tablet/mobile) into fully
 * inherited values, supporting the legacy flat `{ id, focalPoint }` shape.
 * Mobile inherits tablet, tablet inherits desktop, when unset.
 */
function theme_resolve_responsive_image( $image ) {
	if ( ! is_array( $image ) ) {
		$image = [];
	}

	$is_legacy = array_key_exists( 'id', $image ) && ! array_key_exists( 'desktop', $image );

	$desktop = $is_legacy ? $image : ( $image['desktop'] ?? [] );
	if ( ! is_array( $desktop ) ) {
		$desktop = [];
	}
	$desktop = wp_parse_args( $desktop, [ 'id' => null, 'focalPoint' => null ] );

	$tablet = ! $is_legacy && ! empty( $image['tablet'] ) ? wp_parse_args( $image['tablet'], $desktop ) : $desktop;
	$mobile = ! $is_legacy && ! empty( $image['mobile'] ) ? wp_parse_args( $image['mobile'], $tablet ) : $tablet;

	return [
		'desktop' => $desktop,
		'tablet'  => $tablet,
		'mobile'  => $mobile,
	];
}
