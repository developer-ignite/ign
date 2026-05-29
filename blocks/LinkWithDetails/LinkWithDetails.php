<?php
/**
 * LinkWithDetails block template.
 *
 * @var string|null $anchor
 * @var string      $headline
 * @var string      $description
 * @var array       $buttons
 *
 * @var WP_Block $block    Block instance
 * @var string   $children InnerBlocks content
 */
$button = $buttons[0] ?? null;
?>

<div <?php theme_block_props( 'link-with-details discourse-item not-discourse flex flex-col gap-6 [.link-with-details+&]:border-t [.link-with-details+&]:border-charcoal [.link-with-details+&]:mt-8! [.link-with-details+&]:pt-8 [&:has(+.link-with-details)]:mb-0!', [ 'aria-labelledby' => false ] ); ?>>

	<h3 class="text-header-5"><?php echo wp_kses_post( $headline ); ?></h3>

	<?php if ( ! empty( $description ) ) : ?>
		<p class="text-body font-medium"><?php echo wp_kses_post( $description ); ?></p>
	<?php endif; ?>

	<div>
		<?php
		get_template_part(
			'parts/ThemeButton',
			null,
			[
				'link'      => $button,
				'variation' => 'tertiary',
			]
		);
		?>
	</div>

</div>
