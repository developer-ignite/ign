<?php
/**
 * Wide Social Media block frontend template.
 *
 * Available variables (auto-extracted from $attributes):
 * @var string|null $anchor HTML anchor ID
 * @var string      $heading Heading text displayed on the left
 * @var bool        $showLabel Whether to show social media names/labels
 *
 * Also available:
 * @var string   $children Inner blocks content
 * @var WP_Block $block Block instance
 */

$hasHeading = ! empty( $heading );
$hasLinks   = ! empty( $children );
?>

<?php if ( $hasHeading || $hasLinks ) : ?>
<aside <?php theme_block_props( 'wide-social-media' ); ?>>
	<div class="container max-w-[var(--discourse-narrow,55rem)] mt-8 mb-8 border-t border-charcoal pt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

		<?php // Heading ?>
		<?php $heading_id = theme_block_region_id(); ?>
		<?php if ( $hasHeading ) : ?>
			<h2 class="text-header-5" id="<?php echo esc_attr( $heading_id ); ?>"><?php echo wp_kses_post( $heading ); ?></h2>
		<?php endif; ?>

		<?php // Social links — label the nav off the visible heading when present so this nav's
		// accessible name differs from the global Footer's "Social Media Links" nav (axe
		// landmark-unique). Falls back to the static label only when no heading is configured. ?>
		<?php if ( $hasLinks ) : ?>
			<nav
				<?php if ( $hasHeading ) : ?>aria-labelledby="<?php echo esc_attr( $heading_id ); ?>"<?php else : ?>aria-label="<?php echo esc_attr__( 'Social Media Links', 'takt' ); ?>"<?php endif; ?>
				class="md:ml-auto"
			>
				<ul class="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:justify-end md:gap-x-4 md:gap-y-0">
					<?php echo $children; ?>
				</ul>
			</nav>
		<?php endif; ?>

	</div>
</aside>
<?php endif; ?>
