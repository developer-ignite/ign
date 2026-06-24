<?php
/**
 * Featured Events block template.
 *
 * Renders a vertically stacked list of events from The Events Calendar
 * with image/content panels, supporting automatic and manual selection modes.
 *
 * @var string|null $anchor
 * @var string      $eyebrow
 * @var string      $heading
 * @var string      $description
 * @var string      $postsSource
 * @var array       $selectedPosts
 * @var int         $postsLimit
 * @var string      $eventList
 * @var array       $selectedEventCategories
 * @var array       $selectedTags
 * @var bool        $hideIfEmpty
 * @var array       $buttons
 * @var string      $buttonLabel
 *
 * @var WP_Block $block    Block instance
 * @var string   $children InnerBlocks content
 */

$query     = null;
$has_posts = false;

if ( $postsSource === 'manual' && ! empty( $selectedPosts ) ) {
	$query = new WP_Query( [
		'post_type'      => 'tribe_events',
		'post__in'       => $selectedPosts,
		'orderby'        => 'post__in',
		'posts_per_page' => -1,
		'post_status'    => 'publish',
	] );
	$has_posts = $query->have_posts();
} elseif ( $postsSource === 'automatic' ) {
	$now = current_time( 'Y-m-d H:i:s' );

	$args = [
		'post_type'      => 'tribe_events',
		'posts_per_page' => $postsLimit,
		'post_status'    => 'publish',
		'meta_key'       => '_EventStartDate',
		'orderby'        => 'meta_value',
		'meta_query'     => [],
		'tax_query'      => [],
	];

	if ( $eventList === 'past' ) {
		$args['order']         = 'DESC';
		$args['meta_query'][]  = [
			'key'     => '_EventStartDate',
			'value'   => $now,
			'compare' => '<',
			'type'    => 'DATETIME',
		];
	} else {
		$args['order']         = 'ASC';
		$args['meta_query'][]  = [
			'key'     => '_EventStartDate',
			'value'   => $now,
			'compare' => '>=',
			'type'    => 'DATETIME',
		];
	}

	if ( ! empty( $selectedEventCategories ) ) {
		$args['tax_query'][] = [
			'taxonomy' => 'tribe_events_cat',
			'field'    => 'term_id',
			'terms'    => $selectedEventCategories,
		];
	}

	if ( ! empty( $selectedTags ) ) {
		$args['tax_query'][] = [
			'taxonomy' => 'post_tag',
			'field'    => 'term_id',
			'terms'    => $selectedTags,
		];
	}

	$query     = new WP_Query( $args );
	$has_posts = $query->have_posts();
}
?>

<?php if ( empty( $hideIfEmpty ) || $has_posts ) : ?>
	<section <?php theme_block_props( 'featured-events' ); ?>>
		<div class="container">
			<div data-animate="fade-up">
			<?php
			get_template_part( 'parts/ThemeHeading', null, [
				'className'         => 'mb-16',
				'eyebrow'           => $eyebrow,
				'heading'           => $heading,
				'headingSize'       => 2,
				'description'       => $description,
				'columns'           => 2,
				'enableButtons'     => true,
				'buttons'           => $buttons ?? [],
				'buttonVariations'  => [ 'primary' ],
				'enableDescription' => true,
			] );
			?>
			</div>

			<?php if ( $has_posts ) : ?>
				<div class="featured-events-list flex flex-col gap-16" data-animate-stagger>
					<?php while ( $query->have_posts() ) : ?>
						<?php $query->the_post(); ?>
						<?php
						get_template_part( 'parts/card', 'tribe_events', [
							'buttonLabel' => $buttonLabel,
						] );
						?>
					<?php endwhile; ?>
				</div>
			<?php endif; ?>
		</div>
	</section>
<?php endif; ?>
<?php wp_reset_postdata(); ?>
