<?php
/**
 * Card template for Search results.
 *
 * Expected to be called within a WP_Query loop (the_post() already called).
 * Displays post type pill, title, excerpt, and Learn More button.
 */

$post_type_obj = get_post_type_object( get_post_type() );
$post_type_label = $post_type_obj ? $post_type_obj->labels->singular_name : '';
$excerpt = get_the_excerpt();
?>
<a href="<?php the_permalink(); ?>" class="block group no-underline! h-full">
	<div class="search-result-card border border-charcoal rounded-3xl p-6 flex flex-col gap-6 group-hover:bg-accent-lighter group-hover:text-charcoal transition-colors">
		<?php if ( $post_type_label ) : ?>
			<span class="inline-block bg-accent-lighter border border-accent-light text-charcoal group-hover:bg-white/80 group-hover:border-charcoal/20 text-body-small uppercase font-medium tracking-wider px-2 py-1.5 rounded-full w-fit transition-colors">
				<?php echo esc_html( $post_type_label ); ?>
			</span>
		<?php endif; ?>

		<h3 class="text-header-5">
			<?php the_title(); ?>
		</h3>

		<?php if ( ! empty( $excerpt ) ) : ?>
			<p class="text-body font-medium leading-relaxed">
				<?php echo wp_kses_post( $excerpt ); ?>
			</p>
		<?php endif; ?>

		<div class="mt-auto">
			<span class="btn-tertiary">
				<?php esc_html_e( 'Learn More', 'takt' ); ?>
				<span class="btn-tertiary-arrow w-5 h-4 *:w-full *:h-full"><?php theme_asset( 'images/tertiary-arrow.svg' ); ?></span>
			</span>
		</div>
	</div>
</a>
