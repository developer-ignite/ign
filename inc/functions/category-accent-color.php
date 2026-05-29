<?php
/**
 * Accent color picker for the category (Topic) taxonomy admin screens.
 *
 * Uses the same palette defined in parts/ThemeColors.ts.
 */

defined( 'ABSPATH' ) || exit;

/**
 * Shared color definitions – keep in sync with parts/ThemeColors.ts.
 */
function ign_category_accent_colors(): array {
	return [
		'neon-green' => [ 'label' => __( 'Neon Green', 'takt' ), 'hex' => '#D4FF45' ],
		'blue'       => [ 'label' => __( 'Blue', 'takt' ),       'hex' => '#47CBF2' ],
		'green'      => [ 'label' => __( 'Green', 'takt' ),      'hex' => '#78DB6B' ],
		'yellow'     => [ 'label' => __( 'Yellow', 'takt' ),     'hex' => '#FFD24C' ],
		'orange'     => [ 'label' => __( 'Orange', 'takt' ),     'hex' => '#FF7614' ],
		'purple'     => [ 'label' => __( 'Purple', 'takt' ),     'hex' => '#B497D8' ],
	];
}

/**
 * Render the color swatch markup used by both add and edit forms.
 */
function ign_render_accent_color_swatches( string $current = '' ): void {
	$colors = ign_category_accent_colors();
	?>
	<fieldset class="ign-accent-color-picker">
		<label for="accent-color-none" title="<?php esc_attr_e( 'None', 'takt' ); ?>">
			<input
				type="radio"
				id="accent-color-none"
				name="accent_color"
				value=""
				<?php checked( $current, '' ); ?>
			/>
			<span class="ign-color-swatch ign-color-swatch--none"></span>
		</label>
		<?php foreach ( $colors as $class => $color ) :
			$id      = 'accent-color-' . $class;
			$checked = checked( $current, $class, false );
			?>
			<label for="<?php echo esc_attr( $id ); ?>" title="<?php echo esc_attr( $color['label'] ); ?>">
				<input
					type="radio"
					id="<?php echo esc_attr( $id ); ?>"
					name="accent_color"
					value="<?php echo esc_attr( $class ); ?>"
					<?php echo $checked; ?>
				/>
				<span
					class="ign-color-swatch"
					style="background-color: <?php echo esc_attr( $color['hex'] ); ?>;"
				></span>
			</label>
		<?php endforeach; ?>
	</fieldset>
	<?php
}

/**
 * "Add New" form field (appears below the standard fields).
 */
function ign_category_add_form_fields(): void {
	?>
	<div class="form-field">
		<label><?php esc_html_e( 'Accent Color', 'takt' ); ?></label>
		<?php ign_render_accent_color_swatches(); ?>
		<p><?php esc_html_e( 'Choose an accent color for this topic.', 'takt' ); ?></p>
	</div>
	<?php
}
add_action( 'category_add_form_fields', 'ign_category_add_form_fields' );

/**
 * "Edit" form field (table row inside the edit term form).
 */
function ign_category_edit_form_fields( WP_Term $term ): void {
	$current = get_term_meta( $term->term_id, 'accent_color', true );
	?>
	<tr class="form-field">
		<th scope="row">
			<label><?php esc_html_e( 'Accent Color', 'takt' ); ?></label>
		</th>
		<td>
			<?php ign_render_accent_color_swatches( $current ); ?>
			<p class="description"><?php esc_html_e( 'Choose an accent color for this topic.', 'takt' ); ?></p>
		</td>
	</tr>
	<?php
}
add_action( 'category_edit_form_fields', 'ign_category_edit_form_fields' );

/**
 * Save the meta value on create / update.
 */
function ign_save_category_accent_color( int $term_id ): void {
	if ( ! current_user_can( 'edit_term', $term_id ) ) {
		return;
	}

	$valid = array_keys( ign_category_accent_colors() );

	// phpcs:ignore WordPress.Security.NonceVerification.Missing -- WP handles the nonce on term forms.
	$value = isset( $_POST['accent_color'] ) ? sanitize_text_field( wp_unslash( $_POST['accent_color'] ) ) : '';

	if ( in_array( $value, $valid, true ) ) {
		update_term_meta( $term_id, 'accent_color', $value );
	} else {
		delete_term_meta( $term_id, 'accent_color' );
	}
}
add_action( 'created_category', 'ign_save_category_accent_color' );
add_action( 'edited_category', 'ign_save_category_accent_color' );

/**
 * Add an "Accent Color" column to the term list table.
 */
function ign_category_accent_color_column( array $columns ): array {
	$columns['accent_color'] = __( 'Accent Color', 'takt' );
	return $columns;
}
add_filter( 'manage_edit-category_columns', 'ign_category_accent_color_column' );

/**
 * Render the column content.
 */
function ign_category_accent_color_column_content( string $content, string $column_name, int $term_id ): string {
	if ( 'accent_color' !== $column_name ) {
		return $content;
	}

	$value  = get_term_meta( $term_id, 'accent_color', true );
	$colors = ign_category_accent_colors();

	if ( $value && isset( $colors[ $value ] ) ) {
		return sprintf(
			'<span class="ign-color-swatch" style="background-color:%s;" title="%s"></span>',
			esc_attr( $colors[ $value ]['hex'] ),
			esc_attr( $colors[ $value ]['label'] )
		);
	}

	return '<span class="ign-color-swatch ign-color-swatch--none" title="' . esc_attr__( 'None', 'takt' ) . '"></span>';
}
add_filter( 'manage_category_custom_column', 'ign_category_accent_color_column_content', 10, 3 );

/**
 * Make the accent color column sortable.
 */
function ign_category_accent_color_sortable_column( array $columns ): array {
	$columns['accent_color'] = 'accent_color';
	return $columns;
}
add_filter( 'manage_edit-category_sortable_columns', 'ign_category_accent_color_sortable_column' );

/**
 * Handle sorting by accent_color term meta.
 */
function ign_category_accent_color_sort( WP_Term_Query $query ): void {
	if ( ! is_admin() || 'category' !== ( $query->query_vars['taxonomy'][0] ?? '' ) ) {
		return;
	}

	if ( 'accent_color' !== ( $query->query_vars['orderby'] ?? '' ) ) {
		return;
	}

	$query->query_vars['orderby']  = 'meta_value';
	$query->query_vars['meta_key'] = 'accent_color';
	$query->query_vars['meta_query'] = [
		'relation' => 'OR',
		[ 'key' => 'accent_color', 'compare' => 'EXISTS' ],
		[ 'key' => 'accent_color', 'compare' => 'NOT EXISTS' ],
	];
}
add_action( 'pre_get_terms', 'ign_category_accent_color_sort' );

