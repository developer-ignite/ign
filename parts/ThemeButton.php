<?php
  $link = $args['link'] ?? null;
  $variation = $args['variation'] ?? 'primary';
  $className = $args['className'] ?? '';
  $validateLink = $args['validateLink'] ?? false;
  $before = $args['before'] ?? '';
  $after = $args['after'] ?? '';

  // Tertiary buttons get the arrow by default unless $after is explicitly provided
  if ( $variation === 'tertiary' && empty( $after ) ) {
	$after = '<span class="btn-tertiary-arrow w-5 h-4 *:w-full *:h-full">' . theme_asset( 'images/tertiary-arrow.svg', false ) . '</span>';
  }

  $linkTitle = $link['title'] ?? '';
  $linkUrl = $args['link']['url'] ?? null;
if ( $validateLink && $link['postId'] ) {
	$post = get_post( $link['postId'] );
	if ( $post ) {
		if ( get_post_status( $post ) === 'publish' ) {
			$linkUrl = get_permalink( $post );
		} else {
			$linkUrl = null;
		}
	}
}
?>

<?php
$btnClass = trim(
	class_name(
		[
			'btn-primary'   => $variation === 'primary',
			'btn-secondary' => $variation === 'secondary',
			'btn-tertiary'  => $variation === 'tertiary',
		]
	) . ' ' . $className
);

$ariaLabel = '';
if ( ! empty( $link['label'] ) ) {
	$labelTrim = trim( (string) $link['label'] );
	$titleTrim = isset( $link['title'] ) ? trim( (string) $link['title'] ) : '';
	// Treat label as redundant if it matches the title once case + non-alphanumeric (apostrophes,
	// punctuation, whitespace) are normalized away. Prevents acsbace flag for aria-label overriding
	// visible text when an author paste-edits a typo'd duplicate into the label field.
	$normalize = static function ( $s ) {
		return strtolower( preg_replace( '/[^\p{L}\p{N}]/u', '', (string) $s ) );
	};
	if ( $labelTrim !== '' && $normalize( $labelTrim ) !== $normalize( $titleTrim ) ) {
		$ariaLabel = $labelTrim;
		if ( ! empty( $link['opensInNewTab'] ) ) {
			$ariaLabel .= ' ' . __( '(opens in a new tab)', 'takt' );
		}
	}
}
?>
<?php if ( ! empty( $linkUrl ) ) : ?>
  <a
	href="<?php echo esc_attr( $linkUrl ); ?>"
	class="<?php echo esc_attr( $btnClass ); ?>"
	<?php if ( ! empty( $link['opensInNewTab'] ) ) : ?>target="_blank" rel="noopener noreferrer"<?php endif; ?>
	<?php if ( $ariaLabel !== '' ) : ?>aria-label="<?php echo esc_attr( $ariaLabel ); ?>"<?php endif; ?>
  >
	<?php
	// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- $before is trusted HTML from template
	echo $before;
	?>
	<span>
	  <?php echo esc_html( $linkTitle ); ?>
	</span>
	<?php if ( ! empty( $link['opensInNewTab'] ) ) : ?>
	  <span class="sr-only"><?php esc_html_e( '(opens in a new tab)', 'takt' ); ?></span>
	<?php endif; ?>
	<?php
	// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- $after is trusted HTML from template
	echo $after;
	?>
  </a>
<?php endif; ?>
