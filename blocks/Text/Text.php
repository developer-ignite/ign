<?php
/**
 * Text frontend template.
 *
 * Available variables (auto-extracted from $attributes):
 *
 * @var string|null $anchor
 * @var string      $eyebrow
 * @var string      $heading
 * @var string      $description
 * @var array       $buttons
 * @var string      $children Inner blocks content
 * @var WP_Block    $block    Block instance
 */

$hasContent = ! empty( $eyebrow ) || ! empty( $heading ) || ! empty( $description ) || ( ! empty( $buttons ) && array_filter( $buttons, fn( $btn ) => ! empty( $btn['url'] ) || ! empty( $btn['postId'] ) ) );
?>

<section <?php theme_block_props( 'text-block py-6 sm:py-16 not-discourse' ); ?>>
  <div class="container grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-9 items-start">
	<?php if ( $hasContent ) : ?>
		<div data-animate="fade-up">
		<?php
		get_template_part(
			'parts/ThemeHeading',
			null,
			[
				'className'         => 'md:sticky md:top-8',
				'eyebrow'           => $eyebrow,
				'heading'           => $heading,
				'headingSize'       => 2,
				'description'       => $description,
				'buttons'           => $buttons,
				'enableEyebrow'     => true,
				'enableHeading'     => true,
				'enableDescription' => true,
				'enableButtons'     => true,
				'columns'           => 1,
			]
		);
		?>
		</div>
	<?php endif; ?>

	<?php if ( ! empty( $children ) ) : ?>
	  <div class="discourse md:col-start-2<?php echo ! empty( $eyebrow ) ? ' md:pt-[calc(0.875rem*1.1+1rem)]' : ''; ?>" data-animate="fade-up" data-animate-delay="100">
		<?php echo $children; ?>
	  </div>
	<?php endif; ?>
  </div>
</section>
