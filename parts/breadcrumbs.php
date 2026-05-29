<?php
/**
 * Breadcrumbs template part.
 *
 * Generates breadcrumb navigation based on post hierarchy, CPT archives,
 * and taxonomy archives. Uses an ordered list with CSS chevron separators.
 *
 * @var array $args {
 *     @type bool   $isDark         Whether to use dark mode colors. Default false.
 *     @type int    $parent_page_id Optional parent page ID for custom hierarchy.
 *     @type string $className      Additional classes for the nav element. Default ''.
 * }
 */

$is_dark     = $args['isDark'] ?? false;
$extra_class = $args['className'] ?? '';

$link_class = $is_dark ? 'text-white' : 'text-charcoal';
$bold_class = $is_dark ? 'text-white' : 'text-charcoal';

$current_post_id = get_the_ID();
$is_singular     = is_singular();
$is_tax          = is_tax();
$is_archive      = is_archive();

$rewrite_slug    = null;
$current_pt      = null;
$current_pt_obj  = null;

if ( $is_singular ) {
	$current_pt     = get_post_type( $current_post_id );
	$current_pt_obj = $current_pt ? get_post_type_object( $current_pt ) : null;
	$rewrite_slug   = $current_pt_obj->rewrite['slug'] ?? null;
}

if ( $is_tax || $is_archive ) {
	$queried_object = get_queried_object();

	if ( ! empty( $queried_object ) ) {
		if ( $is_archive ) {
			$rewrite_slug = $queried_object->rewrite['slug'] ?? null;
		}

		if ( $is_tax ) {
			$taxonomy_object = get_taxonomy( $queried_object->taxonomy );
			$rewrite_slug    = $taxonomy_object->rewrite['slug'] ?? null;
		}
	}
}

$nav_class = 'breadcrumbs mb-4 uppercase text-sm font-medium leading-[1.1]';
if ( $extra_class ) {
	$nav_class .= ' ' . $extra_class;
}
?>

<nav aria-label="<?php esc_attr_e( 'Breadcrumb', 'takt' ); ?>" class="<?php echo esc_attr( $nav_class ); ?>">
	<ol class="flex items-center gap-2">
		<li>
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="<?php echo esc_attr( $link_class ); ?>">
				<?php esc_html_e( 'Home', 'takt' ); ?>
			</a>
		</li>

		<?php
		// Resolve archive ancestors from rewrite slug hierarchy.
		$archive_ancestors        = [];
		$archive_parent_post_type = null;

		if ( ! empty( $rewrite_slug ) ) {
			$slug = $rewrite_slug;

			if ( strpos( $slug, '/' ) !== false ) {
				$parts       = explode( '/', $slug );
				array_pop( $parts );
				$parent_slug = end( $parts );

				if ( ! $parent_slug ) {
					$parent_slug = prev( $parts );
				}

				if ( $parent_slug ) {
					$matched_page = get_page_by_path( $parent_slug );

					if ( $matched_page ) {
						$archive_ancestors[] = $matched_page->ID;
					} else {
						foreach ( get_post_types( [], 'objects' ) as $obj ) {
							if ( ! empty( $obj->rewrite['slug'] ) && $obj->rewrite['slug'] === $parent_slug ) {
								$archive_parent_post_type = $obj;
							}
						}
					}
				}
			}
		}
		?>

		<?php foreach ( $archive_ancestors as $ancestor_id ) : ?>
			<li>
				<a href="<?php echo esc_url( get_permalink( $ancestor_id ) ); ?>" class="<?php echo esc_attr( $link_class ); ?>">
					<?php echo esc_html( get_the_title( $ancestor_id ) ); ?>
				</a>
			</li>
		<?php endforeach; ?>

		<?php if ( ! empty( $archive_parent_post_type ) && ! empty( $archive_parent_post_type->has_archive ) ) : ?>
			<li>
				<a href="<?php echo esc_url( get_post_type_archive_link( $archive_parent_post_type->rewrite['slug'] ) ); ?>" class="<?php echo esc_attr( $link_class ); ?>">
					<?php echo esc_html( $archive_parent_post_type->labels->archives ?? $archive_parent_post_type->labels->name ); ?>
				</a>
			</li>
		<?php endif; ?>

		<?php if ( $is_singular && ! empty( $current_pt_obj ) && ! empty( $current_pt_obj->has_archive ) ) : ?>
			<li>
				<a href="<?php echo esc_url( get_post_type_archive_link( $current_pt ) ); ?>" class="<?php echo esc_attr( $link_class ); ?>">
					<?php echo esc_html( $current_pt_obj->labels->archives ?? $current_pt_obj->labels->name ); ?>
				</a>
			</li>
		<?php endif; ?>

		<?php
		// Page ancestors.
		$parent_page_id = $args['parent_page_id'] ?? null;

		if ( is_page() || $parent_page_id ) :
			$resolved_page_id = $parent_page_id ? $parent_page_id : $current_post_id;
			$ancestors         = get_post_ancestors( $resolved_page_id );
			$ancestors         = array_reverse( $ancestors );

			foreach ( $ancestors as $ancestor_id ) :
				?>
				<li>
					<a href="<?php echo esc_url( get_permalink( $ancestor_id ) ); ?>" class="<?php echo esc_attr( $link_class ); ?>">
						<?php echo esc_html( get_the_title( $ancestor_id ) ); ?>
					</a>
				</li>
			<?php endforeach; ?>

			<?php if ( $parent_page_id ) : ?>
				<li>
					<a href="<?php echo esc_url( get_permalink( $parent_page_id ) ); ?>" class="<?php echo esc_attr( $link_class ); ?>">
						<?php echo esc_html( get_the_title( $parent_page_id ) ); ?>
					</a>
				</li>
			<?php endif; ?>
		<?php endif; ?>

		<li aria-current="page">
			<span class="font-bold <?php echo esc_attr( $bold_class ); ?>">
				<?php
				if ( is_home() ) {
					echo esc_html( get_the_title( get_option( 'page_for_posts' ) ) );
				} elseif ( is_archive() ) {
					if ( is_category() || is_tag() || is_tax() ) {
						echo esc_html( single_term_title( '', false ) );
					} elseif ( is_post_type_archive() && ! empty( $current_pt_obj ) ) {
						echo esc_html( $current_pt_obj->labels->archives ?? $current_pt_obj->labels->name );
					}
				} else {
					the_title();
				}
				?>
			</span>
		</li>
	</ol>
</nav>
