<?php
/**
 * @var string $tabTitle
 * @var string $tabDescription
 * @var string $tabColor
 * @var string $children
 * @var array  $block
 */
$tabTitle       = $tabTitle ?? '';
$tabDescription = $tabDescription ?? '';
$baseId         = $context['takt/tabs/baseId'] ?? 'tabs-' . uniqid();

// Get block index by finding this block's position among siblings
global $wp_query;
static $tab_index = 0;
$index = $tab_index++;

$panelId = $baseId . '-panel-' . $index;
$tabId   = 'tab-' . $baseId . '-' . $index;
?>
<div class="tabs-item-wrapper md:hidden md:flex-1 md:rounded-3xl transition-colors" data-tab-color="<?php echo esc_attr( $tabColor ); ?>">
  <details
    <?php
    theme_block_props(
      [
        'tabs-item group transition-all overflow-hidden border border-charcoal rounded-3xl' => true,
        'open:bg-accent-lighter open:border open:border-charcoal'                             => true,
        'md:hidden md:open:block md:border-0 md:rounded-3xl md:bg-transparent'               => true,
        'md:overflow-visible md:self-start md:open:p-6' => true,
        $tabColor                                                                            => ! empty( $tabColor ),
      ]
    );
    ?>
  >
    <?php // Summary - visible on mobile and desktop ?>
    <summary class="tabs-item-summary p-6 list-none flex gap-4 items-start appearance-none [&::-webkit-details-marker]:hidden cursor-pointer hover:bg-accent-light group-open:hover:bg-transparent transition-colors md:mb-8 md:p-0 md:cursor-default md:hover:bg-transparent md:group-open:hover:bg-transparent">
      <h3 class="font-heading text-header-3 md:text-[2.5rem] w-full"><?php echo esc_html( $tabTitle ); ?></h3>
      <div class="shrink-0 ml-auto relative w-5 h-5 mt-[9px] md:hidden">
        <div class="w-5 border-current border-b-2 absolute top-1/2 left-0 -translate-y-1/2"></div>
        <div class="w-5 border-current border-b-2 absolute top-1/2 left-0 -translate-y-1/2 transition-transform rotate-90 group-open:rotate-0"></div>
      </div>
    </summary>

    <div class="tabs-item-inner">
      <div class="tabs-item-content px-6 pb-6 pt-2 md:p-0" id="<?php echo esc_attr( $panelId ); ?>" data-tab-id="<?php echo esc_attr( $tabId ); ?>">
        <?php if ( ! empty( $tabDescription ) ) : ?>
          <p class="tabs-item-description text-base font-medium mb-4 md:hidden"><?php echo esc_html( $tabDescription ); ?></p>
        <?php endif; ?>
        <div class="discourse">
          <?php echo $children; ?>
        </div>
      </div>
    </div>
  </details>
</div>
