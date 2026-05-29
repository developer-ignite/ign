<?php
/**
 * Card template for Policy.
 *
 * Expected to be called within a WP_Query loop (the_post() already called).
 * Dark card with accent fill on hover.
 */

$show_tags = $args['showTags'] ?? true;
$topics    = get_the_terms( get_the_ID(), 'policy_topic' );
?>
<div class="card-policy">
	<a href="<?php the_permalink(); ?>" class="block group no-underline! h-full">
		<div class="flex flex-col gap-6 h-full rounded-3xl border dark:border-off-white border-charcoal/10 dark:bg-charcoal bg-off-white p-6 group-hover:bg-accent group-hover:border-accent group-hover:text-charcoal transition-colors">
			<?php if ( $show_tags && ! empty( $topics ) && ! is_wp_error( $topics ) ) : ?>
				<div class="flex flex-wrap gap-2">
					<?php foreach ( $topics as $topic ) : ?>
						<span class="inline-block bg-accent-lighter border border-accent-light text-charcoal group-hover:bg-white/80 group-hover:border-charcoal/20 text-body-small uppercase font-medium tracking-wider px-2 py-1.5 rounded-full transition-colors">
							<?php echo esc_html( $topic->name ); ?>
						</span>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>

			<h3 class="text-header-5">
				<?php the_title(); ?>
			</h3>

			<div class="mt-auto">
				<span class="btn-tertiary group-hover:text-charcoal!">
					<?php esc_html_e( 'View Resource', 'takt' ); ?>
					<span class="btn-tertiary-arrow w-5 h-4 *:w-full *:h-full"><?php theme_asset( 'images/tertiary-arrow.svg' ); ?></span>
				</span>
			</div>
		</div>
	</a>
</div>
