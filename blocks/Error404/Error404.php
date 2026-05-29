<?php
/**
 * Error 404 block template.
 *
 * @var string|null $anchor
 * @var string|null $heading
 * @var string|null $description
 * @var array       $buttons
 *
 * @var WP_Block $block    Block instance
 * @var string   $children InnerBlocks content
 */

$has_text_content = ! empty( $heading ) || ! empty( $description );
$has_buttons      = ! empty( array_filter( $buttons, fn( $btn ) => ! empty( $btn['url'] ) || ! empty( $btn['postId'] ) ) );
?>

<section <?php theme_block_props( 'error-404 pt-20 pb-40 text-center' ); ?>>
	<div class="container grid grid-cols-1 gap-12">
		<?php if ( $has_text_content ) : ?>
			<div class="flex flex-col gap-6">
				<?php if ( ! empty( $heading ) ) : ?>
					<h1 id="<?= theme_block_region_id() ?>" class="text-header-0 leading-none">
						<?php echo esc_html( $heading ); ?>
					</h1>
				<?php endif; ?>

				<?php if ( ! empty( $description ) ) : ?>
					<p class="text-body-large max-w-[600px] mx-auto">
						<?php echo esc_html( $description ); ?>
					</p>
				<?php endif; ?>
			</div>
		<?php endif; ?>

		<?php if ( $has_buttons ) : ?>
			<div class="relative flex flex-wrap items-center justify-center gap-4">
				<?php foreach ( $buttons as $btn ) : ?>
					<?php
					get_template_part(
						'parts/ThemeButton',
						null,
						[
							'link'      => [
								'title'        => $btn['title'] ?? '',
								'url'          => $btn['url'] ?? '',
								'postId'       => $btn['postId'] ?? null,
								'opensInNewTab' => $btn['opensInNewTab'] ?? false,
								'label'        => $btn['label'] ?? '',
							],
							'variation' => $btn['variation'] ?? 'primary',
						]
					);
					?>
				<?php endforeach; ?>
			</div>
		<?php endif; ?>
	</div>
</section>
