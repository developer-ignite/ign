<?php
/**
 * Image Card Block Template
 *
 * Available variables (auto-extracted from $attributes):
 * @var array  $image
 * @var bool   $isTall
 * @var string $alt
 *
 * Also available:
 * @var string   $children Inner blocks content
 * @var WP_Block $block    Block instance
 */

// Context from parent block.
$masonry_style = $block->context['masonryCards/masonryStyle'] ?? false;
$column_count  = $block->context['masonryCards/columnCount'] ?? 2;

$is_tall = $isTall;
?>

<div
data-animate="fade-left"
<?php
	theme_block_props(
		[
			'rounded-3xl overflow-hidden min-h-[298px] h-full relative' => true,
			'sm:min-h-[596px]' => $is_tall && $masonry_style,
			// sm: 2 columns - pattern 2,1,1,2.
			'nth-[4n+1]:sm:col-start-1 nth-[4n+2]:sm:col-start-2 nth-[4n+3]:sm:col-start-1 nth-[4n+4]:sm:col-start-2' => $masonry_style,
			'nth-[4n+1]:sm:row-span-2 nth-[4n+2]:sm:row-span-1 nth-[4n+3]:sm:row-span-1 nth-[4n+4]:sm:row-span-2' => $masonry_style && ! $is_tall,
			// md: 3 columns - pattern 1,2,1,2,1,2.
			'nth-[6n+1]:md:col-start-1 nth-[6n+2]:md:col-start-2 nth-[6n+3]:md:col-start-3 nth-[6n+4]:md:col-start-1 nth-[6n+5]:md:col-start-2 nth-[6n+6]:md:col-start-3' => $masonry_style && $column_count === 3,
			'nth-[6n+1]:md:row-span-1 nth-[6n+2]:md:row-span-2 nth-[6n+3]:md:row-span-1 nth-[6n+4]:md:row-span-2 nth-[6n+5]:md:row-span-1 nth-[6n+6]:md:row-span-2' => $masonry_style && ! $is_tall && $column_count === 3,
			// md: 4 columns - pattern 2,1,2,1,1,2,1,2.
			'nth-[8n+1]:md:col-start-1 nth-[8n+2]:md:col-start-2 nth-[8n+3]:md:col-start-3 nth-[8n+4]:md:col-start-4 nth-[8n+5]:md:col-start-1 nth-[8n+6]:md:col-start-2 nth-[8n+7]:md:col-start-3 nth-[8n+8]:md:col-start-4' => $masonry_style && $column_count === 4,
			'nth-[8n+1]:md:row-span-2 nth-[8n+2]:md:row-span-1 nth-[8n+3]:md:row-span-2 nth-[8n+4]:md:row-span-1 nth-[8n+5]:md:row-span-1 nth-[8n+6]:md:row-span-2 nth-[8n+7]:md:row-span-1 nth-[8n+8]:md:row-span-2' => $masonry_style && ! $is_tall && $column_count === 4,
			// Tall cards in masonry mode - 3 rows.
			'sm:!row-span-3' => $is_tall && $masonry_style,
			'md:!row-span-3' => $is_tall && $masonry_style && $column_count >= 3,
			// Tall cards in non-masonry mode - 2 rows.
			'sm:row-span-2' => $is_tall && ! $masonry_style,
		],
		[ 'role' => 'listitem' ]
	);
	?>
	>
  <?php if ( $image['id'] ) : ?>
		<?php
		$img_attrs = [
			'class' => 'w-full h-full object-cover absolute inset-0',
			'style' => 'object-position: ' . theme_image_position( $image['focalPoint'] ) . ';',
		];
		if ( $alt !== '' ) {
			$img_attrs['alt'] = $alt;
		}
		echo wp_get_attachment_image(
			$image['id'],
			'full',
			false,
			$img_attrs
		);
		?>
  <?php endif; ?>
</div>
