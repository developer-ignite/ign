<?php

/**
 * Makes all IDs in an SVG string unique by appending a suffix.
 *
 * Covers: id definitions, url(#ref) in attributes and inline styles,
 * xlink:href/href fragment references, clip-path/mask/filter/marker
 * presentation attributes, SMIL animation begin/end timing references,
 * aria-labelledby/aria-describedby, and CSS selectors in <style> blocks.
 *
 * @param string $svg The SVG markup.
 * @return string The SVG markup with unique IDs.
 */
function theme_uniquify_svg_ids( $svg ) {
	$uid = 'u' . wp_unique_id();

	// 1. Collect all id values so we only rewrite references to known IDs.
	preg_match_all( '/\bid="([^"]+)"/', $svg, $matches );
	$ids = array_unique( $matches[1] );

	if ( empty( $ids ) ) {
		return $svg;
	}

	// Build a lookup of old → new.
	$map = array();
	foreach ( $ids as $id ) {
		$map[ $id ] = $id . '-' . $uid;
	}

	// Escape IDs for use in regex alternation.
	$escaped = array_map( function ( $id ) {
		return preg_quote( $id, '/' );
	}, $ids );

	// Sort longest-first to avoid partial matches.
	usort( $escaped, function ( $a, $b ) {
		return strlen( $b ) - strlen( $a );
	} );

	$alt = implode( '|', $escaped );

	// 2. Rewrite id="..." definitions.
	$svg = preg_replace_callback(
		'/\bid="(' . $alt . ')"/',
		function ( $m ) use ( $map ) {
			return 'id="' . $map[ $m[1] ] . '"';
		},
		$svg
	);

	// 3. Rewrite url(#...) references (fill, stroke, clip-path, mask, filter, marker, etc.)
	//    Handles both attribute values and inline style declarations.
	$svg = preg_replace_callback(
		'/url\(\s*#(' . $alt . ')\s*\)/',
		function ( $m ) use ( $map ) {
			return 'url(#' . $map[ $m[1] ] . ')';
		},
		$svg
	);

	// 4. Rewrite xlink:href="#..." (SVG 1.1).
	$svg = preg_replace_callback(
		'/xlink:href="#(' . $alt . ')"/',
		function ( $m ) use ( $map ) {
			return 'xlink:href="#' . $map[ $m[1] ] . '"';
		},
		$svg
	);

	// 5. Rewrite href="#..." (SVG 2) — avoid matching xlink:href (negative lookbehind).
	$svg = preg_replace_callback(
		'/(?<!xlink:)href="#(' . $alt . ')"/',
		function ( $m ) use ( $map ) {
			return 'href="#' . $map[ $m[1] ] . '"';
		},
		$svg
	);

	// 6. Rewrite SMIL begin/end timing refs like begin="elementId.click".
	$svg = preg_replace_callback(
		'/(begin|end)="(' . $alt . ')\./',
		function ( $m ) use ( $map ) {
			return $m[1] . '="' . $map[ $m[2] ] . '.';
		},
		$svg
	);

	// 7. Rewrite aria-labelledby and aria-describedby (space-separated ID lists).
	$svg = preg_replace_callback(
		'/(aria-labelledby|aria-describedby)="([^"]+)"/',
		function ( $m ) use ( $map ) {
			$replaced = preg_replace_callback(
				'/\b(' . implode( '|', array_map( function ( $id ) {
					return preg_quote( $id, '/' );
				}, array_keys( $map ) ) ) . ')\b/',
				function ( $inner ) use ( $map ) {
					return $map[ $inner[1] ];
				},
				$m[2]
			);
			return $m[1] . '="' . $replaced . '"';
		},
		$svg
	);

	// 8. Rewrite #id selectors inside <style> blocks.
	$svg = preg_replace_callback(
		'/<style[^>]*>(.*?)<\/style>/s',
		function ( $m ) use ( $map, $alt ) {
			$css = preg_replace_callback(
				'/#(' . $alt . ')\b/',
				function ( $inner ) use ( $map ) {
					return '#' . $map[ $inner[1] ];
				},
				$m[1]
			);
			return str_replace( $m[1], $css, $m[0] );
		},
		$svg
	);

	return $svg;
}


/**
 * Marks the root <svg> element as decorative (aria-hidden="true",
 * focusable="false") when the markup carries no explicit accessibility
 * intent (aria-label, aria-labelledby, aria-hidden, or role).
 *
 * @param string $svg The SVG markup.
 * @return string Possibly-modified SVG markup.
 */
function theme_mark_svg_decorative( $svg ) {
	if ( ! is_string( $svg ) || $svg === '' ) {
		return $svg;
	}
	if ( preg_match( '/<svg\b[^>]*\b(aria-(?:label|labelledby|hidden)|role)\s*=/i', $svg ) ) {
		return $svg;
	}
	return preg_replace( '/<svg\b/i', '<svg aria-hidden="true" focusable="false"', $svg, 1 );
}


/**
 * Echos an external asset into the source code
 *
 * @param string $path path to the asset.
 */
function theme_asset( $path, $echo = true ) {
	$full_path = get_stylesheet_directory() . '/resources/' . $path;

	if ( ! file_exists( $full_path ) ) {
		return '';
	}

	// phpcs:ignore
	$asset = file_get_contents( $full_path, true );
	$asset = preg_replace( '/<\?xml.*?\?>\s*/', '', $asset );
	$asset = theme_uniquify_svg_ids( $asset );
	$asset = theme_mark_svg_decorative( $asset );

	if ( $echo ) {
		echo $asset;
	} else {
		return $asset;
	}
}


/**
 * Outputs or returns an SVG or IMG element based on the provided file.
 *
 * This function checks the MIME type of the provided file array. If the file is an SVG, it outputs
 * the SVG content directly. Otherwise, it outputs an IMG element for the file.
 *
 * @param array $file An array containing file information, typically returned by ACF for an image field.
 * @param bool  $echo Optional. Whether to echo the content or return it. Default true.
 *
 * @return string|null The SVG content or IMG element if $echo is false. Null if $echo is true.
 */
function theme_output_svg_or_img( $file, $echo = true ) {
	$content = '';
	$file_id = ! empty( $file['ID'] ) ? $file['ID'] : $file;

	if ( ! empty( $file_id ) ) {
		$mime = get_post_mime_type( $file_id );

		if ( 'image/svg+xml' === $mime && file_exists( get_attached_file( $file_id ) ) ) {
			$content = file_get_contents( get_attached_file( $file_id ) );
		} else {
			$content = wp_get_attachment_image( $file_id, 'full' );
		}
	}

	$content = preg_replace( '/<\?xml.*?\?>\s*/', '', $content );
	$content = theme_uniquify_svg_ids( $content );
	$content = theme_mark_svg_decorative( $content );

	if ( $echo ) {
		echo $content;
	} else {
		return $content;
	}
}
