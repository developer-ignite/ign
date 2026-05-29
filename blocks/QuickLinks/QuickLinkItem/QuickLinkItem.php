<?php
/**
 * Quick Link Item block frontend template.
 *
 * Available variables (auto-extracted from $attributes):
 * @var string $title Link text/title
 * @var string $url Link URL
 * @var int $postId WordPress post ID (if linking to internal post)
 * @var bool $opensInNewTab Whether link opens in new tab
 * @var string $accentColor
 *
 * Also available:
 * @var string $content Inner blocks content
 * @var WP_Block $block Block instance
 */

// Build link object for ThemeLink
$linkObj = [
	'url'           => $url ?? '',
	'title'         => $title ?? '',
	'postId'        => $postId ?? null,
	'postType'      => ! empty( $postId ) ? get_post_type( $postId ) : null,
	'opensInNewTab' => $opensInNewTab,
];
?>

<li
data-animate="fade-up"
<?php
theme_block_props(
	[
		'quick-link-item' => true,
		$accentColor      => ! empty( $accentColor ),
	]
);
?>
>
	<?php
	ob_start();
	?>
	<span class="font-heading text-xl flex-1">
		<?php echo esc_html( $title ?? '' ); ?>
	</span>
	<span class="shrink-0 text-charcoal">
		<?php theme_block_asset( 'IconArrow.svg' ); ?>
	</span>
	<?php
	$linkChildren = ob_get_clean();

	get_template_part( 'parts/ThemeLink', null, [
		'link'         => $linkObj,
		'className'    => 'group border border-charcoal rounded-3xl py-5 px-6 flex gap-4 items-center no-underline! transition-all hover:bg-accent focus:bg-accent',
		'validateLink' => true,
		'children'     => $linkChildren,
	] );
	?>
</li>
