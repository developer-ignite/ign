<?php
/**
 * Decorate mailto: links with an accessible "opens mail application" warning.
 *
 * Author-entered rich text (FooterInfo contact/hours/addresses, the_content) often contains
 * raw `<a href="mailto:...">` markup with no aria-label. WCAG best practice (acsbace.com BP #7)
 * recommends warning users that activating the link triggers a mail client.
 *
 * This module exposes a helper used by templates that render rich-text user content, plus a
 * the_content filter for post body content.
 */

if ( ! function_exists( 'takt_decorate_mailto_links' ) ) {
	/**
	 * Append "(opens mail application)" to the aria-label of any mailto: anchor in the HTML.
	 * If the anchor has no aria-label, one is created using its visible text content.
	 *
	 * @param string $html HTML fragment.
	 * @return string Modified HTML.
	 */
	function takt_decorate_mailto_links( $html ) {
		if ( empty( $html ) || stripos( $html, 'mailto:' ) === false ) {
			return $html;
		}

		$suffix = __( '(opens mail application)', 'takt' );

		return preg_replace_callback(
			'#<a\b([^>]*?\bhref\s*=\s*"mailto:[^"]*"[^>]*)>(.*?)</a>#is',
			function ( $matches ) use ( $suffix ) {
				$attrs = $matches[1];
				$inner = $matches[2];

				if ( preg_match( '#\baria-label\s*=\s*"([^"]*)"#i', $attrs, $existing ) ) {
					$current = $existing[1];
					if ( stripos( $current, $suffix ) !== false ) {
						return $matches[0];
					}
					$updated = trim( $current ) . ' ' . $suffix;
					$attrs   = preg_replace(
						'#\baria-label\s*=\s*"[^"]*"#i',
						'aria-label="' . esc_attr( $updated ) . '"',
						$attrs,
						1
					);
				} else {
					$visible = trim( wp_strip_all_tags( $inner ) );
					$label   = $visible !== '' ? $visible . ' ' . $suffix : $suffix;
					$attrs  .= ' aria-label="' . esc_attr( $label ) . '"';
				}

				return '<a' . $attrs . '>' . $inner . '</a>';
			},
			$html
		);
	}
}

add_filter( 'the_content', 'takt_decorate_mailto_links', 20 );
add_filter( 'widget_text_content', 'takt_decorate_mailto_links', 20 );
