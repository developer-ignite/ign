<?php
/**
 * Card template for Resource.
 *
 * Expected to be called within a WP_Query loop (the_post() already called).
 * Dark card with accent-colored hover state.
 */

$show_tags      = $args['showTags'] ?? true;
$audiences      = get_the_terms( get_the_ID(), 'audience' );
$resource_types = get_the_terms( get_the_ID(), 'resource_type' );
$excerpt        = get_the_excerpt();
?>
<div class="card-resource">
	<a href="<?php the_permalink(); ?>" class="block group no-underline! h-full">
		<div class="flex flex-col gap-6 h-full rounded-3xl border dark:border-off-white border-charcoal/10 dark:bg-charcoal bg-off-white p-6 group-hover:bg-accent group-hover:border-accent group-hover:text-charcoal transition-colors">
			<?php if ( $show_tags && ( ( ! empty( $audiences ) && ! is_wp_error( $audiences ) ) || ( ! empty( $resource_types ) && ! is_wp_error( $resource_types ) ) ) ) : ?>
				<div class="flex flex-wrap gap-2">
					<?php if ( ! empty( $audiences ) && ! is_wp_error( $audiences ) ) : ?>
						<?php foreach ( $audiences as $audience ) : ?>
							<span class="inline-block bg-accent-lighter border border-accent-light text-charcoal group-hover:bg-white/80 group-hover:border-charcoal/20 text-body-small uppercase font-medium tracking-wider px-2 py-1.5 rounded-full transition-colors">
								<?php echo esc_html( $audience->name ); ?>
							</span>
						<?php endforeach; ?>
					<?php endif; ?>
					<?php if ( ! empty( $resource_types ) && ! is_wp_error( $resource_types ) ) : ?>
						<?php foreach ( $resource_types as $type ) : ?>
							<span class="inline-block bg-accent-lighter border border-accent-light text-charcoal group-hover:bg-white/80 group-hover:border-charcoal/20 text-body-small uppercase font-medium tracking-wider px-2 py-1.5 rounded-full transition-colors">
								<?php echo esc_html( $type->name ); ?>
							</span>
						<?php endforeach; ?>
					<?php endif; ?>
				</div>
			<?php endif; ?>

			<h3 class="text-header-5">
				<?php the_title(); ?>
			</h3>

			<?php if ( ! empty( $excerpt ) ) : ?>
				<p class="text-body-small italic">
					<?php echo wp_kses_post( $excerpt ); ?>
				</p>
			<?php endif; ?>

			<div class="mt-auto">
				<span class="btn-tertiary group-hover:text-charcoal!">
					<?php esc_html_e( 'View Resource', 'takt' ); ?>
					<span class="btn-tertiary-arrow w-5 h-4 *:w-full *:h-full"><?php theme_asset( 'images/tertiary-arrow.svg' ); ?></span>
				</span>
			</div>
		</div>
	</a>
</div>
