<?php
  $link = $args['link'];
  $className = $args['className'] ?? '';
  $titleClassName = $args['titleClassName'] ?? '';
  $tagName = $args['tagName'] ?? 'span';
  $before = $args['before'] ?? '';
  $after = $args['after'] ?? '';
  $children = $args['children'] ?? '';
  $validateLink = $args['validateLink'] ?? false;
  $role = $args['role'] ?? '';

  $linkUrl = $args['link']['url'];
  if($validateLink && !empty($link['postId']) && !empty($link['postType'])){
    if(post_type_exists($link['postType'])){
      $post = get_post($link['postId']);
      if ($post && !is_wp_error($post) && get_post_status($post) === 'publish') {
        $linkUrl = get_permalink($post);
      }else{
        $linkUrl = null;
      }
    }else if(taxonomy_exists($link['postType'])){
      $term = get_term($link['postId'], $link['postType']);
      if ($term && !is_wp_error($term)) {
        $linkUrl = get_term_link($term);
      }else{
        $linkUrl = null;
      }
    }
  }
?>

<?php
$ariaLabel = '';
if ( ! empty( $link['label'] ) ) {
	$labelTrim = trim( (string) $link['label'] );
	$titleTrim = isset( $link['title'] ) ? trim( (string) $link['title'] ) : '';
	if ( $labelTrim !== '' && strcasecmp( $labelTrim, $titleTrim ) !== 0 ) {
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
	class="<?php echo esc_attr( $className ); ?>"
	<?php if ( ! empty( $role ) ) : ?>role="<?php echo esc_attr( $role ); ?>"<?php endif; ?>
	<?php if ( ! empty( $link['opensInNewTab'] ) ) : ?>target="_blank" rel="noopener noreferrer"<?php endif; ?>
	<?php if ( $ariaLabel !== '' ) : ?>aria-label="<?php echo esc_attr( $ariaLabel ); ?>"<?php endif; ?>
  >
<?php elseif ( ! empty( $args['displayEmpty'] ) ) : ?>
  <span
	class="pointer-events-none <?php echo esc_attr( $className ); ?>"
  >
<?php endif; ?>

  <?php if ( ! empty( $linkUrl ) || ! empty( $args['displayEmpty'] ) ) : ?>

		<?php
		if ( $before ) {
			echo $before;}
		?>

		<?php
		if ( empty( $children ) ) {
			printf(
				'<%1$s class="%2$s">%3$s</%1$s>',
				esc_attr( $tagName ),
				esc_attr( ( $titleClassName ?? '' ) ),
				esc_html( $link['title'] )
			);
		} else {
			echo ( $children );
		}
		?>

		<?php if ( ! empty( $link['opensInNewTab'] ) ) : ?>
	  <span class="sr-only"><?php esc_html_e( '(opens in a new tab)', 'takt' ); ?></span>
	<?php endif; ?>

		<?php
		if ( $after ) {
			echo $after;}
		?>

  <?php endif; ?>

<?php if ( ! empty( $linkUrl ) ) : ?>
  </a>
<?php elseif ( ! empty( $args['displayEmpty'] ) ) : ?>
  </span>
<?php endif; ?>
