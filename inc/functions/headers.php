<?php

// Add recommended security headers
function theme_add_security_headers() {
	header( 'X-Frame-Options: SAMEORIGIN' );
	header( 'X-Content-Type-Options: nosniff' );
	header( 'Referrer-Policy: strict-origin-when-cross-origin' );
	header( 'X-XSS-Protection: 1; mode=block' );
	header( 'Permissions-Policy: geolocation=(self), microphone=(), camera=()' );
	header( 'Cross-Origin-Embedder-Policy: unsafe-none' );
	header( 'Cross-Origin-Opener-Policy: same-origin-allow-popups' );
	header( 'Cross-Origin-Resource-Policy: cross-origin' );

	// Send HSTS only if connection is HTTPS
	if ( isset( $_SERVER['HTTPS'] ) && $_SERVER['HTTPS'] === 'on' ) {
		header( 'Strict-Transport-Security: max-age=31536000; includeSubDomains; preload' );
	}

	// Allow developers to override CSP strictness via a filter
	$relaxed_csp = apply_filters( 'theme_relaxed_csp', true );

	// Build CSP depending on relaxed mode
	if ( $relaxed_csp ) {
		$csp = "default-src * data: blob: 'unsafe-inline' 'unsafe-eval'; ";
		$csp .= "script-src * data: blob: 'unsafe-inline' 'unsafe-eval'; ";
		$csp .= "style-src * data: blob: 'unsafe-inline'; ";
	} else {
		$csp = 'default-src * data: blob:; ';
		$csp .= 'script-src *; ';
		$csp .= 'style-src *; ';
	}
	$csp .= 'img-src * data: blob:; ';
	$csp .= 'font-src * data:; ';
	$csp .= 'frame-src *; ';
	$csp .= 'object-src *;';
	header( "Content-Security-Policy: $csp" );
}
add_action( 'send_headers', 'theme_add_security_headers' );
