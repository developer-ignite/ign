<?php
/**
 * Accordion Item frontend template.
 *
 * Available variables (auto-extracted from $attributes):
 * @var string $anchor
 * @var string $title
 * @var bool $openByDefault
 * @var string $accentColor
 *
 * Also available:
 * @var string $children Inner blocks content
 * @var WP_Block $block Block instance
 */
?>
<details
  <?php
	theme_block_props(
		[
			'accordion-item group border border-charcoal rounded-3xl transition-all open:bg-accent-lighter not-open:hover:bg-accent' => true,
			$accentColor => ! empty( $accentColor ),
		]
	);
	?>
  data-animate="fade-up"
  <?php
	if ( ! empty( $openByDefault ) ) {
		echo 'open';}
	?>
>
  <summary class="py-4 px-6 md:p-5 list-none flex gap-4 items-center appearance-none [&::-webkit-details-marker]:hidden cursor-pointer">
	<h3 class="font-heading text-lg md:text-xl w-full">
	  <?php echo wp_kses_post( $title ); ?>
	</h3>
	<div class="shrink-0 ml-auto relative w-4 h-4">
	  <div class="w-4 border-current border-b-2 absolute top-1/2 left-0 -translate-y-1/2"></div>
	  <div class="w-4 border-current border-b-2 absolute top-1/2 left-0 -translate-y-1/2 transition-transform rotate-90 group-open:rotate-0"></div>
	</div>
  </summary>
  <div class="accordion-item-grid">
	<div class="accordion-item-overflow">
	  <div class="px-6 pb-6 md:px-5 md:pb-5 pt-0 discourse">
		<?php echo $children; ?>
	  </div>
	</div>
  </div>
</details>
