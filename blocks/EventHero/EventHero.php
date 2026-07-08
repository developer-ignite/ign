<?php
/**
 * Event Hero Block
 *
 * A full-width hero section for single event pages (The Events Calendar)
 * displaying event title, date/time, venue, organizer, excerpt, and
 * optional external link.
 *
 * Available variables (auto-extracted from $attributes):
 * @var string|null $anchor
 * @var bool        $showExcerpt
 *
 * @var WP_Block $block   Block instance.
 * @var string   $content Block content.
 */

$event_id        = get_the_ID();
$event_title     = get_the_title();
$event_excerpt   = get_the_excerpt();
$featured_img_id = get_post_thumbnail_id();

// Event-specific meta from The Events Calendar
$start_date  = get_post_meta( $event_id, '_EventStartDate', true );
$end_date    = get_post_meta( $event_id, '_EventEndDate', true );
$all_day     = (bool) get_post_meta( $event_id, '_EventAllDay', true );
$venue_id    = get_post_meta( $event_id, '_EventVenueID', true );
// Falls back to the plain-text name captured at ICS import for events
// with no linked Venue post (see inc/helpers/myignite-image-sync.php).
$venue_name      = $venue_id ? get_the_title( $venue_id ) : get_post_meta( $event_id, '_myignite_venue_name', true );

$organizer_ids   = get_post_meta( $event_id, '_EventOrganizerID' );
$organizer_names = array_filter( array_map( 'get_the_title', (array) $organizer_ids ) );
// Falls back to the plain-text name(s) captured at ICS import for events
// with no linked Organizer post.
$organizer_name  = $organizer_names ? implode( ', ', $organizer_names ) : get_post_meta( $event_id, '_myignite_organizer_names', true );
$external_url    = get_post_meta( $event_id, '_EventURL', true );
$event_cost      = get_post_meta( $event_id, '_EventCost', true );
$currency_symbol = get_post_meta( $event_id, '_EventCurrencySymbol', true );
// Only prepend the currency symbol when the cost is numeric, so text-cost
// values like "Free" render as-is instead of "$Free".
$cost_display    = ( $event_cost !== '' && $event_cost !== false )
	? ( ! empty( $currency_symbol ) && is_numeric( $event_cost ) ? $currency_symbol . $event_cost : (string) $event_cost )
	: '';

// Event categories (tribe_events_cat taxonomy)
$event_categories = get_the_terms( $event_id, 'tribe_events_cat' );
$event_categories = is_array( $event_categories ) ? $event_categories : [];

// Build date/time display string and ISO datetime attribute
$date_time_display  = '';
$date_time_iso      = '';

if ( $start_date ) {
	$start_ts = strtotime( $start_date );
	$end_ts   = $end_date ? strtotime( $end_date ) : null;

	if ( $all_day ) {
		// ISO datetime: date only for all-day events
		$date_time_iso = wp_date( 'Y-m-d', $start_ts );
		if ( $end_ts && wp_date( 'Y-m-d', $start_ts ) !== wp_date( 'Y-m-d', $end_ts ) ) {
			$date_time_iso    .= '/' . wp_date( 'Y-m-d', $end_ts );
			$date_time_display = date_i18n( 'F j, Y', $start_ts ) . ' – ' . date_i18n( 'F j, Y', $end_ts );
		} else {
			$date_time_display = date_i18n( 'F j, Y', $start_ts );
		}
	} else {
		// ISO datetime: full datetime for timed events
		$date_time_iso  = wp_date( 'Y-m-d\TH:i', $start_ts );
		$start_date_str = date_i18n( 'F j, Y', $start_ts );
		$start_time_str = date_i18n( 'g:i A', $start_ts );

		if ( ! $end_ts ) {
			$date_time_display = $start_date_str . ' | ' . $start_time_str;
		} elseif ( wp_date( 'Y-m-d', $start_ts ) === wp_date( 'Y-m-d', $end_ts ) ) {
			$date_time_iso    .= '/' . wp_date( 'Y-m-d\TH:i', $end_ts );
			$end_time_str      = date_i18n( 'g:i A', $end_ts );
			$date_time_display = $start_date_str . ' | ' . $start_time_str . ' – ' . $end_time_str;
		} else {
			$date_time_iso    .= '/' . wp_date( 'Y-m-d\TH:i', $end_ts );
			$end_date_str      = date_i18n( 'F j, Y', $end_ts );
			$end_time_str      = date_i18n( 'g:i A', $end_ts );
			$date_time_display = $start_date_str . ', ' . $start_time_str . ' – ' . $end_date_str . ', ' . $end_time_str;
		}
	}
}
?>

<section <?php theme_block_props( 'event-hero grid overflow-visible min-h-[min(800px,100vh)] -mt-(--header-height)' ); ?>>

	<?php // Layer 1: Background image — col-1/row-1, stretches to fill grid ?>
	<div class="col-start-1 row-start-1 overflow-hidden bg-accent h-[calc(var(--header-height)+300px)] md:h-[calc(var(--header-height)+450px)] mask-b-from-40% mask-b-to-100%">
		<?php if ( $featured_img_id ) : ?>
			<?php
			echo wp_get_attachment_image(
				$featured_img_id,
				'full',
				false,
				[
					'class' => 'w-full h-full object-cover',
					'alt'   => '',
					'role'  => 'presentation',
				]
			);
			?>
		<?php endif; ?>
	</div>

	<?php // Layer 2: Gradient — col-1/row-1, extends below for subsequent sections ?>
	<div class="col-start-1 row-start-1 self-start relative -z-1">
		<div class="top-gradient"></div>
	</div>

	<?php // Layer 3: Content — col-1/row-1, aligned to bottom ?>
	<div class="col-start-1 row-start-1 self-end relative z-10 pb-8 sm:pb-16 pt-[var(--header-height)]">
		<div class="container">
			<div class="max-w-[700px] mr-auto">

				<?php // Upper Group: Category Pills + Title ?>
				<div class="flex flex-col gap-6">

					<?php // Category Pills ?>
					<?php if ( ! empty( $event_categories ) ) : ?>
						<div class="flex flex-wrap gap-2" data-animate="fade-up" data-animate-delay="300">
							<?php foreach ( $event_categories as $category ) :
								$accent_color = get_term_meta( $category->term_id, 'accent_color', true );
							?>
								<span class="<?php
								echo class_name(
									[
										'inline-flex items-center justify-center px-2 py-2 rounded-full bg-accent-lighter border border-accent text-sm font-medium uppercase leading-[1.1] whitespace-nowrap shrink-0 text-charcoal' => true,
										$accent_color => ! empty( $accent_color ),
									]
								);
								?>">
									<?php echo esc_html( $category->name ); ?>
								</span>
							<?php endforeach; ?>
						</div>
					<?php endif; ?>

					<?php // Event Title ?>
					<?php if ( $event_title ) : ?>
						<h1 class="text-header-0 text-charcoal" data-animate="fade-up" data-animate-delay="450">
							<?php echo wp_kses_post( $event_title ); ?>
						</h1>
					<?php endif; ?>
				</div>

				<?php // Excerpt (Optional) ?>
				<?php if ( $showExcerpt && ! empty( $event_excerpt ) ) : ?>
					<p class="text-body-large text-charcoal mt-6" data-animate="fade-up" data-animate-delay="600">
						<?php echo wp_kses_post( $event_excerpt ); ?>
					</p>
				<?php endif; ?>

				<?php // Lower Group: Date/Time, Venue, External Link ?>
				<div class="mt-12 flex flex-col gap-1" data-animate="fade-up" data-animate-delay="750">

					<?php // Date/Time Line ?>
					<?php if ( $date_time_display ) : ?>
						<p class="font-heading text-lg leading-[1.2] text-charcoal">
							<time datetime="<?php echo esc_attr( $date_time_iso ); ?>">
								<?php echo esc_html( $date_time_display ); ?>
							</time>
						</p>
					<?php endif; ?>

					<?php // Venue Line ?>
					<?php if ( $venue_name ) : ?>
						<p class="text-lg font-medium leading-[1.2] text-charcoal">
							<?php echo esc_html( $venue_name ); ?>
						</p>
					<?php endif; ?>

					<?php // Organizer Line ?>
					<?php if ( $organizer_name ) : ?>
						<p class="text-lg font-medium leading-[1.2] text-charcoal">
							<?php echo esc_html( $organizer_name ); ?>
						</p>
					<?php endif; ?>

					<?php // Cost Line ?>
					<?php if ( $cost_display !== '' ) : ?>
						<p class="text-lg font-medium leading-[1.2] text-charcoal">
							<?php echo esc_html( $cost_display ); ?>
						</p>
					<?php endif; ?>

					<?php // External Link Button ?>
					<?php if ( $external_url ) : ?>
						<a
							href="<?php echo esc_url( $external_url ); ?>"
							class="btn-primary mt-6 inline-flex self-start"
							target="_blank"
							rel="noopener noreferrer"
						>
							<?php echo esc_html( __( 'Visit Event Website', 'takt' ) ); ?>
							<span class="sr-only">
								<?php
								echo esc_html( ': ' . $event_title . ' ' . __( '(opens in a new tab)', 'takt' ) );
								?>
							</span>
						</a>
					<?php endif; ?>
				</div>
			</div>
		</div>
	</div>
</section>
