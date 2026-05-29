<?php
/**
 * Accordion frontend template.
 *
 * Available variables (auto-extracted from $attributes):
 * @var string $anchor
 * @var string $blockVariation
 * @var string $eyebrow
 * @var string $heading
 * @var string $description
 * @var array $buttons
 * @var string $mediaType
 * @var int $mediaId
 * @var array $focalPoint
 * @var string $videoSource
 * @var int $videoFile
 * @var string $videoId
 * @var array $posterImage
 * @var bool $exclusiveMode
 * @var bool $alwaysOneOpen
 * @var bool $enableFaqSchema
 *
 * Also available:
 * @var string $children Inner blocks content
 * @var WP_Block $block Block instance
 */

$isWithMedia = $blockVariation === 'with-media';
$hasImageMedia = ! empty( $mediaId );
$hasVideo = ( $videoSource === 'file' && ! empty( $videoFile ) ) || ( in_array( $videoSource, [ 'youtube', 'vimeo' ] ) && ! empty( $videoId ) );
$hasMedia = $isWithMedia && ( $mediaType === 'image' ? $hasImageMedia : ( $hasVideo || ! empty( $posterImage['id'] ) ) );
?>

<section 
<?php
theme_block_props(
	[
		'accordion py-6 sm:py-16' => true,
		'accordion--with-media' => $isWithMedia,
	]
);
?>
>
<div class="
<?php
echo class_name(
	[
		'container grid grid-cols-1 md:grid-cols-2 gap-x-16' => true,
		'gap-y-16' => ! $isWithMedia,
		'gap-y-6 md:gap-y-10' => $isWithMedia,
	]
);
?>
  ">

	<?php // Heading section - uses columns=2 for with-media to split eyebrow+heading | description+buttons ?>
	<div data-animate="fade-up" class="<?php echo $isWithMedia ? 'md:col-span-2 md:row-1' : ''; ?>">
	<?php
	get_template_part(
		'parts/ThemeHeading',
		null,
		[
			'className'   => '',
			'eyebrow'     => $eyebrow ?? '',
			'heading'     => $heading ?? '',
			'headingSize' => 2,
			'description' => $description ?? '',
			'buttons'     => $buttons ?? [],
			'columns'     => $isWithMedia ? 2 : 1,
		]
	);
	?>
	</div>

	<?php // Media section - only rendered for with-media variation ?>
	<?php if ( $hasMedia ) : ?>
	  <div class="md:col-1 md:row-2 order-3 md:order-none self-start md:sticky md:top-[calc(var(--header-main-height,0px)+1rem)]">
		<?php if ( $mediaType === 'image' ) : ?>
			<?php // Image ?>
		  <div class="aspect-[4/3] default-mask overflow-hidden">
			<?php
			echo wp_get_attachment_image(
				$mediaId,
				'full',
				false,
				[
					'class' => 'w-full h-full object-cover',
					'style' => 'object-position: ' . theme_image_position( $focalPoint ) . ';',
				]
			);
			?>
		  </div>
		<?php elseif ( $mediaType === 'video' ) : ?>
			<?php // Video ?>
		  <div class="accordion-video-container relative w-full aspect-[4/3] grid grid-cols-1 bg-black overflow-hidden default-mask">

			<?php if ( ! empty( $posterImage['id'] ) ) : ?>
			  <button type="button" class="w-full h-full col-1 row-1 cursor-pointer z-2 accordion-play-button group relative">
				<?php
				echo wp_get_attachment_image(
					$posterImage['id'],
					'full',
					false,
					[
						'class' => 'absolute! inset-0 w-full! h-full! object-cover pointer-events-none!',
						'style' => 'object-position: ' . theme_image_position( $posterImage['focalPoint'] ?? null ) . ';',
					]
				);
				?>

				<?php if ( $hasVideo ) : ?>
				  <span class="absolute inset-0 flex items-center justify-center z-2" aria-hidden="true">
					<span class="play-icon">
					  <?php theme_block_asset( 'IconPlay.svg' ); ?>
					</span>
				  </span>
				<?php endif; ?>
			  </button>
			<?php endif; ?>

			<?php if ( ! empty( $videoFile ) && $videoSource === 'file' ) : ?>
				<?php $video = wp_get_attachment_url( $videoFile ); ?>
			  <video class="w-full h-full object-cover col-1 row-1" playsinline controls preload="none">
				<source src="<?php echo esc_url( $video ); ?>" />
			  </video>
			<?php endif; ?>

			<?php if ( ! empty( $videoId ) && in_array( $videoSource, [ 'vimeo', 'youtube' ] ) ) : ?>
			  <div
				class="w-full h-full embed-video-container *:w-full *:h-full col-1 row-1 *:bg-black"
				data-source="<?php echo esc_attr( $videoSource ); ?>"
				data-video-id="<?php echo esc_attr( $videoId ); ?>"
			  >
				<?php if ( empty( $posterImage['id'] ) ) : ?>
				  <iframe
					src="
					<?php
					echo esc_url(
						$videoSource === 'youtube'
						? 'https://www.youtube.com/embed/' . $videoId . '?autoplay=0&loop=0&mute=0&controls=1&playsinline=1'
						: 'https://player.vimeo.com/video/' . $videoId . '?autoplay=0&byline=0&portrait=0&badge=0&loop=0&background=0&autopause=false&dnt=true&vimeo_logo=false&title=false'
					);
					?>
							"
					class="w-full h-full"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					referrerpolicy="strict-origin-when-cross-origin"
					allowfullscreen></iframe>
				<?php endif; ?>
			  </div>
			<?php endif; ?>

		  </div>
		<?php endif; ?>
	  </div>
	<?php endif; ?>

	<?php // Accordion items - position changes based on variation ?>
	<?php if ( ! empty( $children ) ) : ?>
	  <div class="
		<?php
		echo class_name(
			[
				'self-start relative' => true,
				'md:col-2' => ! $isWithMedia,
				'md:col-2 md:row-2 order-4 md:order-none' => $isWithMedia,
			]
		);
		?>
					">
		<div class="flex flex-col gap-4"
			data-exclusive-mode="<?php echo esc_attr( $exclusiveMode ? 'true' : 'false' ); ?>"
			data-always-one-open="<?php echo esc_attr( $alwaysOneOpen ? 'true' : 'false' ); ?>"
			data-animate-stagger
		>
		  <?php echo $children; ?>
		</div>
	  </div>
	<?php endif; ?>

  </div>
</section>

<?php
// FAQ Schema (JSON-LD) output
if ( ! empty( $enableFaqSchema ) && ! empty( $block->inner_blocks ) ) :
	$faq_items = [];

	foreach ( $block->inner_blocks as $inner_block ) :
		// Extract question from accordion-item title attribute
		$question = isset( $inner_block->attributes['title'] ) ? wp_strip_all_tags( $inner_block->attributes['title'] ) : '';
		$question = trim( $question );

		// Skip if no question
		if ( empty( $question ) ) :
			continue;
		endif;

		// Extract answer from accordion-item's inner blocks content
		$answer_parts = [];
		if ( ! empty( $inner_block->inner_blocks ) ) :
			foreach ( $inner_block->inner_blocks as $content_block ) :
				$rendered = $content_block->render();
				$answer_parts[] = wp_strip_all_tags( $rendered );
			endforeach;
		endif;

		$answer = trim( implode( ' ', $answer_parts ) );

		// Skip if no answer
		if ( empty( $answer ) ) :
			continue;
		endif;

		// Add to FAQ items
		$faq_items[] = [
			'@type'          => 'Question',
			'name'           => $question,
			'acceptedAnswer' => [
				'@type' => 'Answer',
				'text'  => $answer,
			],
		];
	endforeach;

	// Only output schema if we have at least one valid FAQ item
	if ( ! empty( $faq_items ) ) :
		$schema = [
			'@context'   => 'https://schema.org',
			'@type'      => 'FAQPage',
			'mainEntity' => $faq_items,
		];
		?>
		<script type="application/ld+json">
		<?php echo wp_json_encode( $schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ); ?>
		</script>
		<?php
	endif;
endif;
?>
