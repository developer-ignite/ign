<?php
/**
 * Single Event Meta (Venue) Template
 *
 * Override of: [the-events-calendar]/src/views/modules/meta/venue.php
 *
 * Only change from the plugin default: falls back to the plain-text venue
 * name captured at ICS import (_myignite_venue_name, see
 * inc/helpers/myignite-image-sync.php) when the event has no linked Venue
 * post. Address/phone/website are only ever shown for a real linked Venue,
 * since we never capture that structured data for the plain-text case.
 *
 * @version 6.15.11
 *
 * @package TribeEventsCalendar
 */

if ( ! defined( 'ABSPATH' ) ) {
	die( '-1' );
}

$venue_id      = tribe_get_venue_id();
$fallback_name = get_post_meta( get_the_ID(), '_myignite_venue_name', true );

if ( ! $venue_id && ! $fallback_name ) {
	return;
}

$phone         = $venue_id ? tribe_get_phone() : '';
$website       = $venue_id ? tribe_get_venue_website_link() : '';
$website_title = $venue_id ? tribe_events_get_venue_website_title() : '';

?>

<div class="tribe-events-meta-group tribe-events-meta-group-venue">
	<h2 class="tribe-events-single-section-title"> <?php echo esc_html( tribe_get_venue_label_singular() ) ?> </h2>
	<ul class="tribe-events-meta-list">
		<?php do_action( 'tribe_events_single_meta_venue_section_start' ) ?>
		<li class="tribe-events-meta-item tribe-venue"> <?php echo $venue_id ? wp_kses_post( tribe_get_venue() ) : esc_html( $fallback_name ); ?> </li>

		<?php if ( $venue_id && ! post_password_required( $venue_id ) ) : ?>
			<?php if ( tribe_address_exists() ) : ?>
				<li class="tribe-events-meta-item tribe-venue-location">
					<address class="tribe-events-address">
						<?php echo tribe_get_full_address(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped,StellarWP.XSS.EscapeOutput.OutputNotEscaped ?>

						<?php if ( tribe_show_google_map_link() ) : ?>
							<?php echo tribe_get_map_link_html(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped,StellarWP.XSS.EscapeOutput.OutputNotEscaped ?>
						<?php endif; ?>
					</address>
				</li>
			<?php endif; ?>

			<?php if ( ! empty( $phone ) ) : ?>
				<li class="tribe-events-meta-item">
					<span class="tribe-venue-tel-label tribe-events-meta-label"><?php esc_html_e( 'Phone', 'the-events-calendar' ); ?></span>
					<span class="tribe-venue-tel tribe-events-meta-value"> <?php echo esc_html( $phone ); ?> </span>
				</li>
			<?php endif; ?>

			<?php if ( ! empty( $website ) ) : ?>
				<li class="tribe-events-meta-item">
					<?php if ( ! empty( $website_title ) ) : ?>
						<span class="tribe-venue-url-label tribe-events-meta-label"><?php echo esc_html( $website_title ); ?></span>
					<?php endif; ?>
					<span class="tribe-venue-url tribe-events-meta-value"> <?php echo $website; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped,StellarWP.XSS.EscapeOutput.OutputNotEscaped ?> </span>
				</li>
			<?php endif; ?>
		<?php endif; ?>

		<?php do_action( 'tribe_events_single_meta_venue_section_end' ) ?>
	</ul>
</div>
