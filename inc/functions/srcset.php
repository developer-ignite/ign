<?php

function takt_filter_image_srcset( $sources, $size_array, $image_src, $image_meta, $attachment_id ) {
	$srcset = [];

	foreach ( $image_meta['sizes'] as $size => $data ) {
		$image_url = wp_get_attachment_image_url( $attachment_id, $size );

		if ( ! $image_url ) {
			continue;
		}

		$srcset_size = min( $data['width'], $data['height'] );

		$srcset[ $srcset_size ] = [
			'url' => $image_url,
			'descriptor' => 'w',
			'value' => $srcset_size,
		];
	}

	if ( ! empty( $srcset ) ) {
		$srcset[ $size_array[0] ] = [
			'url' => $image_src,
			'descriptor' => 'w',
			'value' => $size_array[0],
		];

		return $srcset;
	} else {
		return $sources;
	}
}

add_filter( 'wp_calculate_image_srcset', 'takt_filter_image_srcset', 10, 5 );
