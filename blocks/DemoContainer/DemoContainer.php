<?php
/**
 * Demo Container frontend template.
 *
 * @var string   $title       Demo container title
 * @var string   $description Optional description text
 * @var string   $children    Inner blocks content
 * @var WP_Block $block       Block instance
 */

// Set defaults for attributes
$title       = $title ?? '';
$description = $description ?? '';
?>

<div <?php
	theme_block_props(
		'demo-container isolate py-8 sm:py-12'
	);
?> role="region" <?php if ( ! empty( $title ) ) : ?>aria-label="<?php echo esc_attr( wp_strip_all_tags( $title ) ); ?>"<?php endif; ?>>
	<?php if ( ! empty( $title ) || ! empty( $description ) ) : ?>
		<div class="container">
			<div class="mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-neutral-300">
				<?php if ( ! empty( $title ) ) : ?>
					<h2 class="text-xl font-bold uppercase text-current text-center"><?php echo wp_kses_post( $title ); ?></h2>
				<?php endif; ?>

				<?php if ( ! empty( $description ) ) : ?>
					<p class="mt-2 text-base opacity-60 max-w-2xl text-center mx-auto"><?php echo wp_kses_post( $description ); ?></p>
				<?php endif; ?>
			</div>
		</div>
	<?php endif; ?>

	<div class="discourse-narrow-container *:first:mt-0! *:last:mb-0!">
		<?php echo $children; ?>
	</div>
</div>
