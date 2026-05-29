<?php

/**
 * Disable AltText AI's content sync to prevent WP_HTML_Tag_Processor
 * bookmark overflow on pages with many images missing alt text.
 *
 * @see https://developer.wordpress.org/reference/classes/wp_html_tag_processor/set_bookmark/
 */
add_filter( 'atai_sync_alt_text_enabled', '__return_false' );
