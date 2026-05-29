<?php
/**
 * Footer Info Social block frontend template.
 *
 * @var string   $children Inner blocks content
 * @var WP_Block $block    Block instance
 */
?>

<nav
	<?php theme_block_props( 'relative' ); ?>
	aria-label="<?php esc_attr_e( 'Social Media Links', 'takt' ); ?>"
>
	<ul class="flex flex-wrap gap-3 items-center">
		<?php echo $children; ?>
	</ul>
</nav>
