<?php

/**
 * Convert long underscore divider runs (commonly pasted from Microsoft Teams
 * meeting invitations) into proper <hr> elements so they render as a single
 * thin line instead of a wall of `_` characters that look like a double
 * underline. Runs at priority 9 so it operates on raw content before
 * wpautop wraps the surrounding paragraphs.
 */
function theme_format_tribe_event_content( $content ) {
	if ( get_post_type() !== 'tribe_events' ) {
		return $content;
	}

	return preg_replace( '/_{20,}/', '<hr class="event-content-divider" />', $content );
}
add_filter( 'the_content', 'theme_format_tribe_event_content', 9 );
