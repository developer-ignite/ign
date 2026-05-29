<?php
/**
 * HeaderItem block frontend template.
 *
 * Available variables (auto-extracted from $attributes):
 * @var array  $link              Link object (url, title, postId, postType, opensInNewTab)
 * @var string $submenuAlignment  Submenu alignment (left, right)
 * @var string $anchor            Block anchor ID
 *
 * Also available:
 * @var string   $children  Inner blocks content
 * @var WP_Block $block     Block instance
 */

// Set defaults for attributes without block.json defaults
$anchor = $anchor ?? 'nav-item-' . wp_unique_id();

// Derived variables
$hasChildren = ! empty( $children );
$linkTitle   = $link['title'] ?? '';
?>

<li <?php theme_block_props( 'list-none relative header-main-item' ); ?>>
	<?php if ( ! $hasChildren ) : ?>
		<?php // Simple link (no submenu) ?>
		<?php
		get_template_part( 'parts/ThemeLink', null, [
			'link'         => $link,
			'className'    => 'flex items-center gap-2 cursor-pointer bg-transparent border-0 p-0 font-sans font-medium text-base md:text-sm lg:text-base leading-[1.16] text-white uppercase no-underline! transition-colors hover:text-neon-green max-md:w-full max-md:justify-between focus-visible:text-neon-green focus-visible:outline-dotted focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2',
			'validateLink' => true,
		] );
		?>
	<?php else : ?>
		<?php // Single button with submenu (CSS handles desktop/mobile layout) ?>
		<button
			type="button"
			class="group header-main-item-button flex items-center gap-2 cursor-pointer bg-transparent border-0 p-0 font-sans font-medium text-base md:text-sm lg:text-base leading-[1.16] text-white uppercase no-underline! transition-colors hover:text-neon-green aria-expanded:text-neon-green max-md:w-full max-md:justify-between focus-visible:text-neon-green focus-visible:outline-dotted focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
			aria-expanded="false"
			aria-controls="<?php echo esc_attr( $anchor ); ?>-submenu"
		>
			<span><?php echo esc_html( $linkTitle ); ?></span>
			<span class="w-3 h-auto transition-transform duration-200 group-aria-expanded:rotate-180">
				<?php theme_block_asset( 'ChevronDown.svg', true, dirname( __DIR__ ) ); ?>
			</span>
		</button>

		<?php // Submenu (single container -- desktop: absolute dropdown, mobile: inline accordion).
		// aria-hidden defaults to true because the submenu starts closed; Header.js toggles
		// it in sync with the parent button's aria-expanded (audit check #10). ?>
		<div
			id="<?php echo esc_attr( $anchor ); ?>-submenu"
			class="header-main-item-submenu hidden text-white md:absolute md:top-full md:mt-6 md:-ml-6 md:bg-charcoal md:rounded-xl md:p-6 md:w-max md:min-w-[calc(100%+3rem)] md:z-[210] max-md:w-full before:md:absolute before:md:bottom-full before:md:left-0 before:md:w-full before:md:h-6 before:md:content-[''] <?php echo esc_attr( $submenuAlignment === 'right' ? 'md:right-0 md:-mr-6' : 'md:left-0' ); ?>"
			style="position-try-fallbacks: flip-inline;"
			aria-hidden="true"
		>
			<ul class="flex flex-col md:gap-4 max-md:gap-1 list-none p-0 m-0 max-md:pl-6 max-md:mt-4">
				<?php echo $children; ?>
			</ul>
		</div>
	<?php endif; ?>
</li>
