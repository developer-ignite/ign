<?php
  $defaultButtonVariations = [ 'primary', 'secondary', 'tertiary' ];
  $eyebrow = $args['eyebrow'] ?? '';
  $heading = $args['heading'] ?? '';
  $description = $args['description'] ?? '';
  $buttons = $args['buttons'] ?? array();
  $className = $args['className'] ?? '';
  $headingSize = $args['headingSize'] ?? 2;
  $headingTag = $args['headingTag'] ?? 'h2';
  $alignment = $args['alignment'] ?? 'left';
  $columns = $args['columns'] ?? 1;
  $enableEyebrow = $args['enableEyebrow'] ?? true;
  $enableHeading = $args['enableHeading'] ?? true;
  $enableDescription = $args['enableDescription'] ?? true;
  $enableButtons = $args['enableButtons'] ?? true;
  $eyebrowClassName = $args['eyebrowClassName'] ?? '';
  $headingClassName = $args['headingClassName'] ?? '';
  $descriptionClassName = $args['descriptionClassName'] ?? '';
  $buttonsClassName = $args['buttonsClassName'] ?? '';
  $buttonVariations = $args['buttonVariations'] ?? $defaultButtonVariations;
  $animateFields = $args['animateFields'] ?? false;
  $animateBaseDelay = (int) ( $args['animateBaseDelay'] ?? 300 );
  $animateStagger = (int) ( $args['animateStagger'] ?? 150 );
  $animateFieldAttrs = fn( $index ) => $animateFields
	  ? ' data-animate="fade-up" data-animate-delay="' . ( $animateBaseDelay + $index * $animateStagger ) . '"'
	  : '';
?>

<?php $hasButtons = $enableButtons && ! empty( $buttons ) && array_filter( $buttons, fn( $btn ) => ! empty( $btn['url'] ) || ! empty( $btn['postId'] ) ); ?>
<?php if ( ( $enableEyebrow && ! empty( $eyebrow ) ) || ( $enableHeading && ! empty( $heading ) ) || ( $enableDescription && ! empty( $description ) ) || $hasButtons ) : ?>
<div class="
	<?php
	echo class_name(
		[
			'theme-heading grid grid-cols-1 h-fit' => true,
			'md:grid-cols-2 gap-x-20' => $columns == 2,
			'md:items-center' => $columns == 2 && ! $hasButtons,
			'text-left text-pretty' => $alignment === 'left',
			'text-center text-balance' => $alignment === 'center',
			'text-right text-pretty' => $alignment === 'right',
		]
	) . ' ' . esc_attr( $className );
	?>
  ">

	<?php if ( ( $enableEyebrow && ! empty( $eyebrow ) ) || ( $enableHeading && ! empty( $heading ) ) ) : ?>
	  <div class="group">
		<?php if ( $enableEyebrow && ! empty( $eyebrow ) ) : ?>
		  <div class="
			<?php
			echo class_name(
				[
					'not-last:mb-4 uppercase text-sm font-medium leading-[1.1]' => true,
					'not-group-last:last:mb-4' => $columns == 1,
					'not-group-last:last:max-md:mb-4' => $columns == 2,
				]
			) . ' ' . esc_attr( $eyebrowClassName );
			?>
		  "<?php echo $animateFieldAttrs( 0 ); ?>>
			<?php echo wp_kses_post( $eyebrow ); ?>
		  </div>
		<?php endif; ?>

		<?php if ( $enableHeading && ! empty( $heading ) ) : ?>
			<?php
			echo '<' . $headingTag . ' ';
			echo 'class="' . class_name(
				[
					'not-group-last:mb-8' => $columns == 1,
					'not-group-last:max-md:mb-8' => $columns == 2,
					'text-header-0' => $headingSize == 0,
					'text-header-1' => $headingSize == 1,
					'text-header-2' => $headingSize == 2,
					'text-header-3' => $headingSize == 3,
				]
			) . ' ' . $headingClassName . '" ';
			echo 'id="' . theme_block_region_id() . '"';
			echo $animateFieldAttrs( 1 );
			echo '>';
			  echo wp_kses_post( nl2br( $heading ) );
			echo '</' . $headingTag . '>';
			?>
		<?php endif; ?>
	  </div>
	<?php endif; ?>

	<?php if ( ( $enableDescription && ! empty( $description ) ) || $hasButtons ) : ?>
	  <div class="
		<?php
		echo class_name(
			[
				'group flex flex-col' => true,
				'md:pt-[calc(0.875rem*1.1+1rem)]' => $columns == 2 && $enableEyebrow && ! empty( $eyebrow ),
			]
		);
		?>
	  ">
		<?php if ( $enableDescription && ! empty( $description ) ) : ?>
		  <p class="not-last:mb-8 <?php echo esc_attr( $descriptionClassName ); ?>"<?php echo $animateFieldAttrs( 2 ); ?>>
			<?php echo wp_kses_post( $description ); ?>
		  </p>
		<?php endif; ?>
		<?php if ( $hasButtons ) : ?>
		  <div class="
			<?php
			echo class_name(
				[
					'inline-flex flex-wrap gap-x-4 gap-y-2 items-center first:mt-auto' => true,
					'justify-start' => $alignment === 'left',
					'md:first:ml-auto' => $columns == 2 && $alignment === 'left',
					'justify-center' => $alignment === 'center',
					'justify-right' => $alignment === 'right',
				]
			) . ' ' . esc_attr( $buttonsClassName );
			?>
		  "<?php echo $animateFieldAttrs( 3 ); ?>>
			<?php
			foreach ( $buttons as $i => $button ) :
				get_template_part(
					'parts/ThemeButton',
					null,
					[
						'link' => $button,
						'variation' => $buttonVariations[ $i % count( $buttonVariations ) ],
					]
				);
			endforeach;
			?>
		  </div>
		<?php endif; ?>
	  </div>
	<?php endif; ?>

  </div>
<?php endif; ?>
