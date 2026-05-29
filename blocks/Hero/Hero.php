<?php
/**
 * Hero block template.
 *
 * @var string|null $anchor
 * @var string      $blockVariation
 * @var string|null $eyebrow
 * @var string|null $heading
 * @var string|null $description
 * @var array       $buttons
 * @var array       $image
 * @var bool        $enableQuickNav
 * @var bool        $showBreadcrumbs
 *
 * @var WP_Block $block    Block instance
 * @var string   $children InnerBlocks content
 */
$isPrimary       = $blockVariation === 'primary';
$isSecondary     = $blockVariation === 'secondary';
$hasImage        = ! empty( $image['id'] );
$hasBreadcrumbs  = ! empty( $showBreadcrumbs );
?>

<section <?php
	theme_block_props(
		[
			'hero grid overflow-visible -mt-(--header-height)' => true,
			'hero--primary'                  => $isPrimary,
			'hero--secondary'                => $isSecondary,
		]
	);
?>>

	<?php // Layer 1: Background image — col-1/row-1, stretches to fill grid ?>
	<div class="hero-image-reveal col-start-1 row-start-1 overflow-hidden bg-accent h-[calc(var(--header-height)+300px)] md:h-[calc(var(--header-height)+450px)]">
		<?php if ( $hasImage ) : ?>
			<?php
			echo wp_get_attachment_image(
				$image['id'],
				'full',
				false,
				[
					'class' => 'w-full h-full object-cover',
					'style' => 'object-position: ' . theme_image_position( $image['focalPoint'] ?? null ) . ';',
					'alt'   => '',
				]
			);
			?>
		<?php endif; ?>
	</div>

	<?php // Layer 2: Gradient — col-1/row-1, margin-top aligns with content text position ?>
	<div class="col-start-1 row-start-1 self-start relative -z-1 mt-[calc(var(--header-height)+180px)] md:mt-[calc(var(--header-height)+300px)]">
		<div class="top-gradient"></div>
	</div>

	<?php // Layer 3: Content — col-1/row-1, padding-top for minimum top spacing ?>
	<div class="col-start-1 row-start-1 self-end relative z-10 pt-[calc(var(--header-height)+180px)] md:pt-[calc(var(--header-height)+300px)] pb-8 sm:pb-16">
		<div class="container">
			<?php if ( $hasBreadcrumbs ) : ?>
				<div data-animate="fade-up" data-animate-delay="600">
					<?php get_template_part( 'parts/breadcrumbs' ); ?>
				</div>
			<?php endif; ?>

			<?php
			get_template_part(
				'parts/ThemeHeading',
				null,
				[
					'className'        => class_name(
						[
							'max-w-[912px]' => $isPrimary,
							'max-w-[700px]' => $isSecondary,
							'mx-auto'       => $isPrimary,
							'mr-auto'       => $isSecondary,
						]
					),
					'alignment'        => $isPrimary ? 'center' : 'left',
					'enableEyebrow'    => ! $hasBreadcrumbs,
					'eyebrow'          => $eyebrow ?? '',
					'heading'          => $heading ?? '',
					'headingTag'       => 'h1',
					'headingSize'      => 0,
					'headingClassName' => class_name(
						[
							'text-[2.5rem] md:text-[length:var(--text-header-0)]' => $isPrimary,
						]
					),
					'description'      => $description ?? '',
					'buttons'          => $isSecondary ? ( $buttons ?? [] ) : [],
					'animateFields'    => true,
					'animateBaseDelay' => 600,
					'animateStagger'   => 150,
				]
			);
			?>

			<?php // Quick Navigation (Primary only) ?>
			<?php if ( $isPrimary && ! empty( $enableQuickNav ) && ! empty( $children ) ) : ?>
				<div class="<?php
					echo class_name(
						[
							'mt-8 sm:mt-12'  => true,
							'max-w-[912px]'  => true,
							'mx-auto'        => $isPrimary,
						]
					);
				?>" data-animate="fade-up" data-animate-delay="1050">
					<?php echo $children; ?>
				</div>
			<?php endif; ?>
		</div>
	</div>
</section>
