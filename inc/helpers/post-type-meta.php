<?php

function theme_register_post_type_meta( $post_type, $meta ) {
	if ( empty( $post_type ) || empty( $meta ) ) {
		return;
	}

	$default_args = [
		'type'              => 'string',
		'single'            => true,
		'show_in_rest'      => true,
		'revisions_enabled' => false,
		'auth_callback'     => function () {
			return current_user_can( 'edit_posts' );
		},
	];

	foreach ( $meta as $key => $item ) {
		if ( is_string( $item ) ) {
			$meta_name = $item;
			$args = [];
		} else {
			$meta_name = $key;
			$args = $item;
		}

		$merged_args = array_merge( $default_args, $args );
		register_post_meta( $post_type, $meta_name, $merged_args );
	}
}

function theme_add_meta_to_revision_fields( $fields, $post ) {
	$post_type = is_array( $post ) ? $post['post_type'] : $post->post_type;
	$meta_keys = wp_post_revision_meta_keys( $post_type );

	foreach ( $meta_keys as $key ) {
		$fields[ $key ] = ucwords( trim( str_replace( '_', ' ', $key ) ) );
	}

	return $fields;
}
add_filter( '_wp_post_revision_fields', 'theme_add_meta_to_revision_fields', 10, 2 );

function theme_show_meta_value_for_revision( $revision_field, $field, $compare_from, $context ) {
	$parent = get_post( $compare_from->parent );
	$post_type = ! empty( $parent ) ? $parent->post_type : $compare_from->post_type;
	$meta_details = get_registered_meta_keys( 'post', $post_type );
	$type = $meta_details[ $field ]['type'] ?? 'string';

	if ( $type === 'boolean' ) {
		return $revision_field === '1' ? esc_attr( 'True', 'takt' ) : esc_attr( 'False', 'takt' );
	} else if ( is_array( $revision_field ) ) {
		if ( ! empty( $revision_field ) && count( $revision_field ) > 0 ) {
			return json_encode( $revision_field );
		} else {
			return '';
		}
	} else {
		return (string) $revision_field;
	}
}

function theme_setup_post_meta_revision() {
	$post_types = get_post_types( [], 'names' );

	foreach ( $post_types as $post_type ) {
		$meta_keys = wp_post_revision_meta_keys( $post_type );

		foreach ( $meta_keys as $meta_key ) {
			add_filter( "_wp_post_revision_field_{$meta_key}", 'theme_show_meta_value_for_revision', 20, 4 );
		}
	}
}
add_filter( 'init', 'theme_setup_post_meta_revision', 20 );
