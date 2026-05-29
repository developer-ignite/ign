<?php
/**
 * Related Events — intentionally suppressed.
 *
 * The theme renders its own Related Events carousel via
 * theme_render_related_events_carousel() (see inc/functions/tribe-events.php),
 * which outputs the Dynamic Content Carousel block in events + related mode.
 *
 * This override of ECP's `pro/related-events.php` returns early so ECP's
 * default Related Events markup doesn't render alongside the theme's.
 *
 * Override of: [events-calendar-pro]/src/views/pro/related-events.php
 */

if ( ! defined( 'ABSPATH' ) ) {
	die( '-1' );
}

return;
