<?php
/**
 * @var string $tabsHeading
 * @var string $tabsDescription
 * @var string $tabsColor
 * @var string $eyebrow
 * @var string $heading
 * @var string $headingSize
 * @var string $description
 * @var array  $buttons
 * @var string $anchor
 * @var string $children
 * @var array  $block
 */
$hasTabs         = ! empty( $tabsHeading );
$baseId          = $anchor ?? uniqid();
$ariaLabel       = ! empty( $heading ) ? $heading : 'Tabs';
$headingSizeMap  = [ 'small' => 3, 'regular' => 2, 'big' => 1 ];
$headingLevel    = $headingSizeMap[ $headingSize ?? 'regular' ] ?? 2;
?>

<section <?php theme_block_props( 'tabs py-6 sm:py-16' ); ?>>
  <div class="container grid grid-cols-1 gap-y-16">

	<div data-animate="fade-up">
	<?php
	get_template_part(
		'parts/ThemeHeading',
		null,
		[
			'eyebrow'     => $eyebrow ?? '',
			'heading'     => $heading ?? '',
			'headingSize' => $headingLevel,
			'description' => $description ?? '',
			'buttons'     => $buttons ?? [],
			'columns'     => 2,
		]
	);
	?>
	</div>

	<?php if ( $hasTabs ) : ?>
	  <div class="tabs-layout flex flex-col md:flex-row items-stretch" data-animate="fade-up" data-animate-delay="150">

		<?php // Desktop tablist - hidden on mobile. ARIA tab roles are added by Tabs.js
		// only when the desktop layout is active, so the markup doesn't advertise a
		// tab interface that isn't present on mobile (audit checks #51/#53/#55). ?>
		<div class="tabs-tablist hidden md:flex flex-col gap-4 py-16 flex-1 md:sticky md:top-[calc(var(--fixed-elements-height)+32px)] md:self-start" data-aria-label="<?php echo esc_attr( $ariaLabel ); ?>">
		  <?php foreach ( $tabsHeading as $index => $title ) : ?>
			<?php
			$tabId    = 'tab-' . $baseId . '-' . $index;
			$panelId  = $baseId . '-panel-' . $index;
			$tabColor = $tabsColor[ $index ] ?? '';
			?>
			<button
			  type="button"
			  class="<?php
				echo class_name(
					[
						'tabs-button border-l border-t border-b border-charcoal rounded-l-3xl p-6 flex flex-col items-start justify-center w-full text-left transition-all cursor-pointer min-h-[140px] hover:bg-accent-light' => true,
						'bg-accent selected hover:!bg-accent' => $index === 0,
						$tabColor                              => ! empty( $tabColor ),
					]
				);
			  ?>"
			  id="<?php echo esc_attr( $tabId ); ?>"
			  data-aria-controls="<?php echo esc_attr( $panelId ); ?>"
			  data-default-selected="<?php echo $index === 0 ? '1' : '0'; ?>"
			  data-tab-color="<?php echo esc_attr( $tabColor ); ?>"
			>
			  <span class="tabs-button-title font-heading text-header-3 md:text-[2.5rem] leading-none w-full"><?php echo wp_kses_post( $title ); ?></span>
			  <?php if ( ! empty( $tabsDescription[ $index ] ) ) : ?>
				<div class="<?php echo class_name( [
					'tabs-button-description grid transition-all duration-300 w-full' => true,
					'grid-rows-[1fr] opacity-100 mt-6' => $index === 0,
					'grid-rows-[0fr] opacity-0 mt-0' => $index !== 0,
				] ); ?>"<?php echo $index !== 0 ? ' aria-hidden="true"' : ''; ?>><span class="overflow-hidden min-h-0 text-base font-medium"><?php echo wp_kses_post( $tabsDescription[ $index ] ); ?></span></div>
			  <?php endif; ?>
			</button>
		  <?php endforeach; ?>
		</div>

		<?php // Tab panels container - holds the <details> elements ?>
		<div class="tabs-panels flex-1 flex flex-col gap-4 md:gap-0 md:items-stretch">
		  <?php echo $children; ?>
		</div>

	  </div>
	<?php endif; ?>

  </div>
</section>
