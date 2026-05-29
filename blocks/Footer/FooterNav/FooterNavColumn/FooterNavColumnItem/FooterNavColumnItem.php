<?php
/**
 * Footer Nav Column Item block frontend template.
 *
 * Available variables (auto-extracted from $attributes):
 * @var array $link
 *
 * Also available:
 * @var string   $children Inner blocks content
 * @var WP_Block $block    Block instance
 */
?>

<li <?php theme_block_props( 'text-xs leading-normal' ); ?>>
	<?php
	get_template_part( 'parts/ThemeLink', null, [
		'link'           => $link,
		'className'      => 'text-xs font-medium leading-normal font-sans no-underline! hover:underline! hover:text-neon-green text-white transition-colors',
		'titleClassName' => 'w-full',
		'validateLink'   => true,
	] );
	?>
</li>
