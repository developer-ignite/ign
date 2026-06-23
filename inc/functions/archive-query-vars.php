<?php
/**
 * Register custom query vars for Archive block filtering.
 */
function theme_archive_query_vars( $vars ) {
	$vars[] = 'search';
	$vars[] = 'topic';
	$vars[] = 'department';
	$vars[] = 'audience';
	$vars[] = 'resource-type';
	$vars[] = 'policy-topic';
	$vars[] = 'show_per_page';
	$vars[] = 'post_type_filter';
	$vars[] = 'date_from';
	$vars[] = 'date_to';

	return $vars;
}
add_filter( 'query_vars', 'theme_archive_query_vars' );
