<?php
get_template_part(
	'parts/ThemeButton',
	null,
	[
		'link' => $button,
		'variation' => $button['variation'] ?? 'primary',
	]
);
