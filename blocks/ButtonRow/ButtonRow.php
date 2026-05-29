<?php
  $alignment = $style['typography']['textAlign'] ?? 'left';

  echo '<' . $tagName . ' ';
  theme_block_props( 'button-row block' );
  echo '>';
	echo '<span class="' . class_name(
		[
			'flex flex-wrap gap-x-4 gap-y-2 items-center' => true,
			'justify-start' => $alignment === 'left',
			'justify-center' => $alignment === 'center',
			'justify-end' => $alignment === 'right',
		]
	);
	echo '">';
	  echo $children;
	echo '</span>';
	echo '</' . $tagName . '>';
