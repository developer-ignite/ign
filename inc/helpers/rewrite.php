<?php

function theme_prioritize_nested_taxonomy_rewrites() {
	add_filter( 'rewrite_rules_array', 'theme_add_nested_taxonomy_rewrite_rules' );
}

function theme_add_nested_taxonomy_rewrite_rules( $rules ) {
	$new_rules = [];

	foreach ( get_taxonomies( [], 'objects' ) as $taxonomy ) {
		if ( ! theme_should_prioritize_taxonomy( $taxonomy ) ) {
			continue;
		}

		$slug = trim( $taxonomy->rewrite['slug'], '/' );
		$taxonomy_name = $taxonomy->name;

		$new_rules[ "{$slug}/([^/]+)/?$" ] = "index.php?{$taxonomy_name}=\$matches[1]";
		$new_rules[ "{$slug}/([^/]+)/page/?([0-9]{1,})/?$" ] = "index.php?{$taxonomy_name}=\$matches[1]&paged=\$matches[2]";
	}

	return $new_rules + $rules;
}

function theme_should_prioritize_taxonomy( $taxonomy ) {
	return (
	isset( $taxonomy->rewrite['slug'] ) &&
	strpos( $taxonomy->rewrite['slug'], '/' ) !== false &&
	$taxonomy->public &&
	$taxonomy->query_var !== false
	);
}

add_action( 'init', 'theme_prioritize_nested_taxonomy_rewrites' );
