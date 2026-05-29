<?php
/**
 * Footer Credits block frontend template.
 *
 * Available variables (auto-extracted from $attributes):
 * @var string $copyrightText
 *
 * Also available:
 * @var string   $children Inner blocks content
 * @var WP_Block $block    Block instance
 */

$currentYear = date( 'Y' );
?>

<div <?php theme_block_props( 'py-4 text-white' ); ?>>
	<div class="flex flex-col md:flex-row items-center gap-4 md:gap-6">
		<?php // Legal links ?>
		<?php if ( ! empty( trim( $children ) ) ) : ?>
			<nav class="md:order-3" aria-label="<?php esc_attr_e( 'Legal Links', 'takt' ); ?>">
				<ul class="flex flex-wrap gap-6 justify-center md:justify-end list-none">
					<?php echo $children; ?>
				</ul>
			</nav>
		<?php endif; ?>

		<?php // Copyright ?>
		<div class="text-xs font-medium leading-normal font-sans text-center md:text-left md:order-1">
			&copy; <?php echo esc_html( $currentYear ); ?> <?php echo esc_html( $copyrightText ); ?>
		</div>

		<?php // Attribution ?>
		<div class="text-xs font-medium leading-normal font-sans text-center md:order-2 md:mx-auto">
			<?php echo esc_html__( 'Website by', 'takt' ); ?> <a href="https://takt.com" target="_blank" rel="noopener noreferrer" class="underline hover:no-underline! hover:text-neon-green text-white transition-colors">Takt</a>
		</div>
	</div>
</div>
