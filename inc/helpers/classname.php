<?php

function class_name( array $classes ): string {
	return esc_attr( implode( ' ', array_keys( array_filter( $classes, fn( $value ) => $value !== false ) ) ) );
}
