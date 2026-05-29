<?php

function theme_image_position( $focal_point ) {
	if ( ! is_array( $focal_point ) ) {
		return 'center center';
	}
	$x = isset( $focal_point['x'] ) ? floatval( $focal_point['x'] ) * 100 : 50;
	$y = isset( $focal_point['y'] ) ? floatval( $focal_point['y'] ) * 100 : 50;
	return esc_attr( "{$x}% {$y}%" );
}
