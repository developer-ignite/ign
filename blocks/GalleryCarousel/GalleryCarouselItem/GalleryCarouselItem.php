<?php
$hasImage = ! empty( $image['id'] );
?>

<div <?php theme_block_props( 'swiper-slide' ); ?>>
	<div class="w-full">
		<?php if ( $hasImage ) : ?>
			<?php
			echo wp_get_attachment_image(
				$image['id'],
				'full',
				false,
				[
					'class' => 'w-full! h-auto! object-cover aspect-[1.08] sm:aspect-[2.45]',
					'style' => 'object-position: ' . theme_image_position( $image['focalPoint'] ?? null ) . ';',
				]
			);
			?>
		<?php endif; ?>
	</div>
</div>
