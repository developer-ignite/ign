<?php
/**
 * Card template for The Events Calendar (tribe_events).
 *
 * Called within a WP_Query loop (the_post() already called).
 * Renders a two-panel event card: image half (left) and content half (right).
 *
 * @var array  $args        Template args passed via get_template_part().
 * @var string $buttonLabel CTA button text (passed from parent block via $args).
 */

$button_label = $args['buttonLabel'] ?? __( 'View Event', 'takt' );
$event_id     = get_the_ID();
$permalink    = get_permalink( $event_id );

$start_date    = get_post_meta( $event_id, '_EventStartDate', true );
$venue_id      = get_post_meta( $event_id, '_EventVenueID', true );
$venue_name    = $venue_id ? get_the_title( $venue_id ) : '';
$event_excerpt = get_the_excerpt();

$day_of_week = '';
$day_number  = '';
$month_year  = '';

$accessible_date = '';
if ( $start_date ) {
	$timestamp       = strtotime( $start_date );
	$day_of_week     = date_i18n( 'D', $timestamp );
	$day_number      = date_i18n( 'j', $timestamp );
	$month_year      = date_i18n( 'M Y', $timestamp );
	$accessible_date = date_i18n( get_option( 'date_format' ), $timestamp );
}
?>

<div data-animate="fade-up">
	<a href="<?php echo esc_url( $permalink ); ?>" class="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8 group no-underline! w-full">
		<?php /* Image half */ ?>
		<div class="relative md:py-8 before:absolute before:bg-charcoal before:rounded-3xl before:-z-1 before:-inset-x-[calc(var(--side-gutter)/2)] before:-inset-y-4 md:before:inset-y-0 md:before:-inset-x-(--bg-extend)">
			<div class="relative flex flex-col items-end w-full overflow-hidden rounded-xl p-2 aspect-[4/3] md:max-h-[350px]">
				<?php if ( has_post_thumbnail() ) : ?>
					<?php
					the_post_thumbnail( 'full', [
						'class' => 'absolute inset-0 w-full h-full object-cover rounded-lg',
						'alt'   => get_the_title(),
					] );
					?>
				<?php endif; ?>

				<?php if ( $start_date ) : ?>
					<div class="relative ml-auto w-[104px] bg-charcoal rounded-lg py-3 px-1 text-center text-white flex flex-col items-center">
						<span class="sr-only"><?php echo esc_html( $accessible_date ); ?></span>
						<span class="font-sans font-medium text-base leading-[1.5]" aria-hidden="true"><?php echo esc_html( $day_of_week ); ?></span>
						<span class="font-heading text-[2.5rem] leading-[1.1]" aria-hidden="true"><?php echo esc_html( $day_number ); ?></span>
						<span class="font-sans font-medium text-base leading-[1.5]" aria-hidden="true"><?php echo esc_html( $month_year ); ?></span>
					</div>
				<?php endif; ?>
			</div>
		</div>

		<?php /* Content half */ ?>
		<div class="relative py-3 md:py-8 flex flex-col justify-between text-white before:absolute before:bg-charcoal before:rounded-3xl before:-z-1 before:-inset-x-[calc(var(--side-gutter)/2)] before:-inset-y-4 md:before:inset-y-0 md:before:-inset-x-(--bg-extend)">
			<div class="flex flex-col gap-2 mb-6">
				<h3 class="text-header-3 md:text-[3rem] md:leading-[1.1]"><?php the_title(); ?></h3>

				<?php if ( $venue_name ) : ?>
					<p class="font-sans font-medium text-base leading-[1.5]"><?php echo esc_html( $venue_name ); ?></p>
				<?php endif; ?>

				<?php if ( $event_excerpt ) : ?>
					<p class="font-sans font-medium text-base leading-[1.5]"><?php echo wp_kses_post( $event_excerpt ); ?></p>
				<?php endif; ?>
			</div>

			<span class="btn-tertiary text-white group-hover:text-[var(--accent-color)]!">
				<?php echo esc_html( $button_label ); ?>
				<span class="sr-only"><?php echo wp_kses_post( sprintf( __( ': %s', 'takt' ), get_the_title() ) ); ?></span>
				<span class="btn-tertiary-arrow w-5 h-4 *:w-full *:h-full"><?php theme_asset( 'images/tertiary-arrow.svg' ); ?></span>
			</span>
		</div>
	</a>
</div>
