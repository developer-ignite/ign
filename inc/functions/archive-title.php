<?php

function theme_change_archive_title( $title ) {
	if ( is_post_type_archive() ) {
		$title = post_type_archive_title( '', false );
	} elseif ( is_tax() ) {
		$title = single_term_title( '', false );
	}
	return $title;
}

add_filter( 'get_the_archive_title', 'theme_change_archive_title' );
