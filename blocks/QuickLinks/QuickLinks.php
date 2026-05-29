<?php
/**
 * Quick Links block frontend template.
 *
 * Available variables (auto-extracted from $attributes):
 * @var string $anchor Block anchor ID
 * @var string $eyebrow Eyebrow text above heading
 * @var string $heading Main heading text
 * @var string $description Description text
 * @var array $buttons Array of button objects
 *
 * Also available:
 * @var string $children Inner blocks content
 * @var WP_Block $block Block instance
 */

// Check if we have any content to display
$hasContent = ! empty( $eyebrow ?? '' ) || ! empty( $heading ?? '' ) || ! empty( $description ?? '' ) || ! empty( array_filter( $buttons ?? [], fn( $btn ) => ! empty( $btn['url'] ) || ! empty( $btn['postId'] ) ) );
$hasLinks   = ! empty( $children );
?>

<?php if ( $hasContent || $hasLinks ) : ?>
<section <?php theme_block_props( 'quick-links py-16 md:py-20' ); ?>>
	<div class="container grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">

		<?php // Left column: Content ?>
		<div data-animate="fade-up">
		<?php
		get_template_part(
			'parts/ThemeHeading',
			null,
			[
				'eyebrow'     => $eyebrow ?? '',
				'heading'     => $heading ?? '',
				'headingSize' => 2,
				'description' => $description ?? '',
				'buttons'     => $buttons ?? [],
			]
		);
		?>
		</div>

		<?php // Right column: Link cards ?>
		<?php if ( $hasLinks ) : ?>
			<nav aria-label="<?php echo esc_attr( ! empty( $heading ?? '' ) ? $heading : __( 'Quick links', 'takt' ) ); ?>" class="flex flex-col gap-4 self-start">
				<ul class="flex flex-col gap-4" data-animate-stagger>
					<?php echo $children; ?>
				</ul>
			</nav>
		<?php endif; ?>

	</div>
</section>
<?php endif; ?>
