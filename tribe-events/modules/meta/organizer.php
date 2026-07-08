<?php
/**
 * Single Event Meta (Organizer) Template
 *
 * Override of: [the-events-calendar]/src/views/modules/meta/organizer.php
 *
 * Only change from the plugin default: also lists the plain-text organizer
 * name(s) captured at ICS import (_myignite_organizer_names, see
 * inc/helpers/myignite-image-sync.php) for events with no linked Organizer
 * post. Phone/email/website are only ever shown for a real linked
 * Organizer, since we never capture that structured data for the
 * plain-text case.
 *
 * @version 6.15.16
 *
 * @package TribeEventsCalendar
 */

if ( ! defined( 'ABSPATH' ) ) {
	die( '-1' );
}

$organizer_ids = tribe_get_organizer_ids();

$fallback_raw   = get_post_meta( get_the_ID(), '_myignite_organizer_names', true );
$fallback_names = $fallback_raw ? array_filter( array_map( 'trim', explode( ',', $fallback_raw ) ) ) : array();

if ( empty( $organizer_ids ) && empty( $fallback_names ) ) {
	return;
}

$multiple = ( count( $organizer_ids ) + count( $fallback_names ) ) > 1;

$phone         = $organizer_ids ? tribe_get_organizer_phone() : '';
$email         = $organizer_ids ? tribe_get_organizer_email() : '';
$website       = $organizer_ids ? tribe_get_organizer_website_link() : '';
$website_title = $organizer_ids ? tribe_events_get_organizer_website_title() : '';
?>

<div class="tribe-events-meta-group tribe-events-meta-group-organizer">
	<h2 class="tribe-events-single-section-title"><?php echo tribe_get_organizer_label( ! $multiple ); ?></h2>
	<ul class="tribe-events-meta-list">
		<?php
		do_action( 'tribe_events_single_meta_organizer_section_start' );

		foreach ( $organizer_ids as $organizer ) {
			if ( ! $organizer ) {
				continue;
			}

			?>
			<li class="tribe-events-meta-item tribe-organizer">
				<?php echo tribe_get_organizer_link( $organizer ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped,StellarWP.XSS.EscapeOutput.OutputNotEscaped ?>
			</li>
			<?php
		}

		// Plain-text organizer name(s) for events with no linked Organizer post.
		foreach ( $fallback_names as $fallback_name ) {
			?>
			<li class="tribe-events-meta-item tribe-organizer">
				<?php echo esc_html( $fallback_name ); ?>
			</li>
			<?php
		}

		if ( ! $multiple && ! empty( $organizer_ids[0] ) && ! post_password_required( $organizer_ids[0] ) ) {
			if ( ! empty( $phone ) ) {
				?>
				<li class="tribe-events-meta-item">
					<span class="tribe-organizer-tel-label tribe-events-meta-label">
						<?php esc_html_e( 'Phone', 'the-events-calendar' ); ?>
					</span>
					<span class="tribe-organizer-tel tribe-events-meta-value">
						<?php echo esc_html( $phone ); ?>
					</span>
				</li>
				<?php
			}//end if

			if ( ! empty( $email ) ) {
				?>
				<li class="tribe-events-meta-item">
					<span class="tribe-organizer-email-label tribe-events-meta-label">
						<?php esc_html_e( 'Email', 'the-events-calendar' ); ?>
					</span>
					<span class="tribe-organizer-email tribe-events-meta-value">
						<?php echo esc_html( $email ); ?>
					</span>
				</li>
				<?php
			}//end if

			if ( ! empty( $website ) ) {
				?>
				<li class="tribe-events-meta-item">
					<?php if ( ! empty( $website_title ) ) : ?>
						<span class="tribe-organizer-url-label tribe-events-meta-label">
							<?php echo esc_html( $website_title ); ?>
						</span>
					<?php endif; ?>
					<span class="tribe-organizer-url tribe-events-meta-value">
						<?php echo $website; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped,StellarWP.XSS.EscapeOutput.OutputNotEscaped ?>
					</span>
				</li>
				<?php
			}//end if
		}//end if

		do_action( 'tribe_events_single_meta_organizer_section_end' );
		?>
	</ul>
</div>
