<?php
/**
 * Custom ordering for Policies
 */

add_action( 'add_meta_boxes', function() {
    add_meta_box(
        'policy_sort_order',
        'Sort Order',
        'render_policy_sort_order_meta_box',
        'policy',
        'side',
        'high'
    );
});

function render_policy_sort_order_meta_box( $post ) {
    wp_nonce_field( 'policy_sort_order_nonce', 'policy_sort_order_nonce' );
    $value = get_post_meta( $post->ID, '_policy_sort_order', true );
    echo '<label for="policy_sort_order">Order (lower numbers appear first)</label>';
    echo '<input type="number" id="policy_sort_order" name="policy_sort_order" value="' . esc_attr( $value ) . '" style="width:100%;margin-top:5px;" />';
}

add_action( 'save_post_policy', function( $post_id ) {
    if (
        ! isset( $_POST['policy_sort_order_nonce'] ) ||
        ! wp_verify_nonce( $_POST['policy_sort_order_nonce'], 'policy_sort_order_nonce' )
    ) return;

    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;
    if ( ! current_user_can( 'edit_post', $post_id ) ) return;

    if ( isset( $_POST['policy_sort_order'] ) ) {
        update_post_meta(
            $post_id,
            '_policy_sort_order',
            intval( $_POST['policy_sort_order'] )
        );
    }
});