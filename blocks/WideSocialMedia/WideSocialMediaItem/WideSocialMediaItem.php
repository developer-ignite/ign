<?php
/**
 * Wide Social Media Item block frontend template.
 *
 * Available variables (auto-extracted from $attributes):
 * @var string|null $anchor     HTML anchor ID
 * @var array       $link       Link configuration with URL, title, label, opensInNewTab
 * @var int|null    $logoId     WordPress media attachment ID for the icon
 * @var string|null $iconSlug   Slug identifier for a suggested social media icon SVG
 * @var string      $label      Visible text label displayed next to the icon
 *
 * Also available:
 * @var string   $children Inner blocks content
 * @var WP_Block $block    Block instance
 */

$url = $link['url'] ?? '';

// Skip rendering if no URL
if ( empty( $url ) ) {
	return;
}

$linkTitle     = $link['title'] ?? '';
$linkLabel     = $link['label'] ?? '';
$opensInNewTab = $link['opensInNewTab'] ?? true;
$showLabel     = $block->context['takt/wide-social-media/showLabel'] ?? true;

// Title attribute for hover when label is hidden
$titleAttr = ! $showLabel ? ( $label ?: $linkTitle ) : '';

// Resolve icon: suggested slug takes priority over media library
$iconHtml = '';
if ( ! empty( $iconSlug ) ) {
	$iconFile = __DIR__ . '/resources/icon-' . sanitize_file_name( $iconSlug ) . '.svg';
	if ( file_exists( $iconFile ) ) {
		$iconHtml = file_get_contents( $iconFile );
		$iconHtml = preg_replace( '/<\?xml.*?\?>\s*/', '', $iconHtml );
	}
} elseif ( ! empty( $logoId ) ) {
	$iconHtml = theme_output_svg_or_img( $logoId, false );
}
?>

<li <?php theme_block_props( 'block list-none' ); ?>>
	<a
		href="<?php echo esc_url( $url ); ?>"
		<?php if ( $opensInNewTab ) : ?>
			target="_blank"
			rel="noopener noreferrer"
		<?php endif; ?>
		<?php if ( ! empty( $linkLabel ) ) : ?>
			aria-label="<?php echo esc_attr( $linkLabel ); ?>"
		<?php endif; ?>
		<?php if ( ! empty( $titleAttr ) ) : ?>
			title="<?php echo esc_attr( $titleAttr ); ?>"
		<?php endif; ?>
		class="flex items-center gap-3 py-2 no-underline! hover:underline! transition-colors"
	>
		<?php // Icon ?>
		<?php if ( ! empty( $iconHtml ) ) : ?>
			<span class="w-6 h-6 shrink-0 *:w-6 *:h-6 *:object-contain *:object-center">
				<?php
				// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- SVG markup from trusted local files or theme_output_svg_or_img
				echo $iconHtml;
				?>
			</span>
		<?php endif; ?>

		<?php // Label - only show when showLabel is true ?>
		<?php if ( $showLabel && ! empty( $label ) ) : ?>
			<span class="text-xs font-medium leading-normal">
				<?php echo wp_kses_post( $label ); ?>
			</span>
		<?php endif; ?>

		<?php // Screen reader text for link title ?>
		<?php if ( ! empty( $linkTitle ) && empty( $linkLabel ) ) : ?>
			<span class="sr-only"><?php echo esc_html( $linkTitle ); ?></span>
		<?php endif; ?>

		<?php // Screen reader text for new tab ?>
		<?php if ( $opensInNewTab ) : ?>
			<span class="sr-only"><?php echo esc_html__( '(opens in new tab)', 'takt' ); ?></span>
		<?php endif; ?>
	</a>
</li>
