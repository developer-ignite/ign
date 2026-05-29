<?php
/**
 * Masonry Cards Block Template
 *
 * Available variables (auto-extracted from $attributes):
 * @var string $eyebrow
 * @var string $heading
 * @var string $description
 * @var array  $buttons
 * @var int    $columnCount
 * @var bool   $masonryStyle
 *
 * Also available:
 * @var string   $children Inner blocks content
 * @var WP_Block $block    Block instance
 */
?>

<section <?php theme_block_props( 'py-6 sm:py-16' ); ?>>
  <div class="container">
	<div data-animate="fade-up">
	<?php
	get_template_part(
		'parts/ThemeHeading',
		null,
		[
			'eyebrow'     => $eyebrow,
			'heading'     => $heading,
			'headingSize' => 2,
			'description' => $description,
			'buttons'     => $buttons,
			'columns'     => 2,
		]
	);
	?>
	</div>

	<?php if ( ! empty( $children ) ) : ?>
	  <div role="list" class="
		<?php
		echo class_name(
			[
				'grid gap-6 mt-16 grid-cols-1 sm:grid-cols-2' => true,
				'md:grid-cols-3' => $columnCount === 3,
				'md:grid-cols-4' => $columnCount === 4,
				'sm:grid-flow-dense sm:auto-rows-[minmax(0,1fr)_48px_minmax(0,1fr)]' => $masonryStyle,
				'sm:grid-flow-dense sm:auto-rows-[minmax(0,1fr)]' => ! $masonryStyle,
			]
		);
		?>
		" data-animate-stagger="column">
		<?php echo $children; ?>
	  </div>
	<?php endif; ?>
  </div>
</section>
