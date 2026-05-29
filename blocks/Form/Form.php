<?php
// $headingPosition is auto-extracted with default 'beside' from block.json
?>

<section <?php theme_block_props( 'form-block py-6 sm:py-16' ); ?>>
<div data-animate="fade-up" class="
<?php
echo class_name(
	[
		'container grid grid-cols-1 gap-x-20 gap-y-16' => true,
		'max-w-175' => $headingPosition === 'above',
		'md:grid-cols-2 relative' => $headingPosition === 'beside',
	]
);
?>
  ">
	<?php
	get_template_part(
		'parts/ThemeHeading',
		null,
		[
			'className'   => $headingPosition === 'beside' ? 'md:sticky md:top-[calc(var(--fixed-elements-height)+24px)] self-start' : '',
			'alignment'   => $headingPosition === 'above' ? 'center' : 'left',
			'eyebrow'     => $eyebrow ?? '',
			'heading'     => $heading ?? '',
			'headingSize' => 2,
			'description' => $description ?? '',
			'buttons'     => $buttons ?? [],
		]
	);
	?>

	<?php if ( ! empty( $formId ) && ( function_exists( 'gravity_form' ) || shortcode_exists( 'gravityform' ) ) ) : ?>
	  <div class="
		<?php
		echo class_name(
			[
				'relative self-start' => true,
				'md:col-2' => $headingPosition === 'beside',
			]
		);
		?>
	  ">
		<div class="form-section-form">
		  <?php echo do_shortcode( '[gravityform id="' . esc_attr( $formId ) . '" title="false" description="false" ajax="true"]' ); ?>
		</div>
	  </div>
	<?php endif; ?>
  </div>
</section>
