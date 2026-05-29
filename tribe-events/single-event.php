<?php
/**
 * Single Event Template
 *
 * Removes back-link, title, schedule, header navigation, and featured image
 * since the Event Hero block handles those. Keeps content, meta, and footer.
 *
 * Override of: [plugin]/src/views/single-event.php
 *
 * @version 4.6.19
 */

if ( ! defined( 'ABSPATH' ) ) {
	die( '-1' );
}

$events_label_singular = tribe_get_event_label_singular();
$event_id              = Tribe__Events__Main::postIdHelper( get_the_ID() );

/** This filter is documented in the-events-calendar/src/views/single-event.php */
$event_id = apply_filters( 'tec_events_single_event_id', $event_id );
?>

<div id="tribe-events-content" class="tribe-events-single">

	<!-- Notices -->
	<?php tribe_the_notices(); ?>

	<?php while ( have_posts() ) : the_post(); ?>
		<div id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

			<!-- Event content -->
			<?php do_action( 'tribe_events_single_event_before_the_content' ); ?>
			<div class="tribe-events-single-event-description tribe-events-content">
				<?php the_content(); ?>
			</div>
			<!-- .tribe-events-single-event-description -->
			<?php do_action( 'tribe_events_single_event_after_the_content' ); ?>

			<!-- Event meta -->
			<?php do_action( 'tribe_events_single_event_before_the_meta' ); ?>
			<?php tribe_get_template_part( 'modules/meta' ); ?>
			<?php do_action( 'tribe_events_single_event_after_the_meta' ); ?>

		</div> <!-- #post-x -->
		<?php if ( get_post_type() === Tribe__Events__Main::POSTTYPE && tribe_get_option( 'showComments', false ) ) {
			comments_template();
		} ?>
	<?php endwhile; ?>

</div><!-- #tribe-events-content -->
