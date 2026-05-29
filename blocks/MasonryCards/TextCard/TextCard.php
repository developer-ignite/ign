<?php
/**
 * Text Card Block Template
 *
 * Available variables (auto-extracted from $attributes):
 * @var string $title
 * @var string $content
 * @var bool   $isTall
 * @var string $accentColor
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
			'relative rounded-3xl p-6 flex flex-col justify-between min-h-[298px] h-full before:absolute before:inset-0 before:bg-accent before:rounded-3xl before:-z-1' => true,
			'sm:min-h-[596px]' => $is_tall && $masonry_style,
			// Tall cards: split background into top/bottom halves on desktop.
			'md:before:inset-x-0 md:before:top-0 md:before:h-1/2 md:after:absolute md:after:inset-x-0 md:after:top-auto md:after:bottom-0 md:after:h-1/2 md:after:bg-accent md:after:rounded-3xl md:after:-z-1' => $is_tall,
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
			$accentColor     => ! empty( $accentColor ),
		],
		[ 'role' => 'listitem' ]
	);
	?>
	>
  <?php if ( ! empty( $title ) ) : ?>
	<h3 class="
		<?php
		echo class_name(
			[
				'masonry-card-title mb-4 break-words relative z-1' => true,
				'text-header-1' => mb_strlen( strip_tags( $title ) ) <= 10,
				'text-header-3' => mb_strlen( strip_tags( $title ) ) > 10,
				'md:pb-8' => $is_tall,
			]
		);
		?>
		">
		<?php echo wp_kses_post( $title ); ?>
	</h3>
  <?php endif; ?>

  <?php if ( ! empty( $content ) ) : ?>
	<p class="
		<?php
		echo class_name(
			[
				'text-base relative z-1' => true,
				'md:pt-8' => $is_tall,
			]
		);
		?>
		">
		<?php echo wp_kses_post( $content ); ?>
	</p>
  <?php endif; ?>
</div>
