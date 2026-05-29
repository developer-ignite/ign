<?php
/**
 * HeaderSubItem block frontend template.
 *
 * Available variables (auto-extracted from $attributes):
 * @var array $link  Link object (url, title, postId, postType, opensInNewTab)
 *
 * Also available:
 * @var string   $children  Inner blocks content
 * @var WP_Block $block     Block instance
 */

// Set defaults for attributes
$link = $link ?? [];
?>

<li <?php theme_block_props( 'list-none' ); ?>>
	<?php
	get_template_part( 'parts/ThemeLink', null, [
		'link'           => $link,
		'className'      => 'py-2 font-sans font-medium text-base leading-[1.16] text-white uppercase no-underline! hover:text-neon-green transition-colors block whitespace-nowrap focus-visible:text-neon-green focus-visible:outline-dotted focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2',
		'titleClassName' => 'w-full',
		'validateLink'   => true,
	] );
	?>
</li>
