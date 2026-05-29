<?php

function takt_tp_context_map(): array {
	return [
		'headerStyleOverride' => 'takt/template/headerStyleOverride',
	];
}

add_filter(
	'register_block_type_args',
	function ( $args, $name ) {
		if ( $name !== 'core/template-part' ) {
			return $args;
		}

		$args['attributes'] = $args['attributes'] ?? [];
		foreach ( array_keys( takt_tp_context_map() ) as $attr ) {
			if ( ! isset( $args['attributes'][ $attr ] ) ) {
				$args['attributes'][ $attr ] = [
					'type' => 'string',
					'default' => '',
				];
			}
		}
		return $args;
	},
	10,
	2
);

function takt_tp_read_from_usage( array $attrs, string $attr_name ): string {
	if ( array_key_exists( $attr_name, $attrs ) && $attrs[ $attr_name ] !== '' && $attrs[ $attr_name ] !== null ) {
		return (string) $attrs[ $attr_name ];
	}
	return '';
}

$GLOBALS['takt_tp_ctx_stack'] = [];

add_filter(
	'render_block_context',
	function ( array $context, array $parsed_block ): array {
		if ( empty( $GLOBALS['takt_tp_ctx_stack'] ) ) {
			return $context;
		}
		$top = end( $GLOBALS['takt_tp_ctx_stack'] );
		if ( $top ) {
			foreach ( $top as $k => $v ) {
				$context[ $k ] = $v;
			}
		}
		return $context;
	},
	10,
	2
);

add_filter(
	'pre_render_block',
	function ( $pre_render, array $parsed_block ) {
		if ( ( $parsed_block['blockName'] ?? '' ) !== 'core/template-part' ) {
			return $pre_render;
		}

		$attrs = $parsed_block['attrs'] ?? [];
		$payload = [];
		foreach ( takt_tp_context_map() as $attr_name => $ctx_key ) {
			$payload[ $ctx_key ] = takt_tp_read_from_usage( $attrs, $attr_name );
		}

		$GLOBALS['takt_tp_ctx_stack'][] = $payload;

		return $pre_render;
	},
	9,
	2
);

add_filter(
	'render_block',
	function ( $html, array $parsed_block ) {
		if ( ( $parsed_block['blockName'] ?? '' ) !== 'core/template-part' ) {
			return $html;
		}
		array_pop( $GLOBALS['takt_tp_ctx_stack'] );
		return $html;
	},
	10,
	2
);
