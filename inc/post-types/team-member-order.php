<?php
/**
 * Custom ordering for Team Members
 */

// --- Add "Sort Order" meta box ---
add_action( 'add_meta_boxes', function() {
    add_meta_box(
        'team_member_sort_order',
        'Sort Order',
        'render_team_member_sort_order_meta_box',
        'team_member', // matches the slug in register_post_type()
        'side',
        'high'
    );
});

function render_team_member_sort_order_meta_box( $post ) {
    wp_nonce_field( 'team_member_sort_order_nonce', 'team_member_sort_order_nonce' );
    $value = get_post_meta( $post->ID, '_team_member_sort_order', true );
    echo '<label for="team_member_sort_order">Order (lower numbers appear first)</label>';
    echo '<input type="number" id="team_member_sort_order" name="team_member_sort_order" value="' . esc_attr( $value ) . '" style="width:100%;margin-top:5px;" />';
}

// --- Save the meta field ---
add_action( 'save_post_team_member', function( $post_id ) {
    if (
        ! isset( $_POST['team_member_sort_order_nonce'] ) ||
        ! wp_verify_nonce( $_POST['team_member_sort_order_nonce'], 'team_member_sort_order_nonce' )
    ) return;

    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;
    if ( ! current_user_can( 'edit_post', $post_id ) ) return;

    if ( isset( $_POST['team_member_sort_order'] ) ) {
        update_post_meta(
            $post_id,
            '_team_member_sort_order',
            intval( $_POST['team_member_sort_order'] )
        );
    }
});

// --- Reorder the Team Members archive query ---
add_action( 'pre_get_posts', function( $query ) {
    if (
        ! is_admin() &&
        $query->is_main_query() &&
        $query->get( 'post_type' ) === 'team_member'
    ) {
        $query->set( 'meta_query', [
            'relation' => 'OR',
            [
                'key'     => '_team_member_sort_order',
                'compare' => 'EXISTS',
            ],
            [
                'key'     => '_team_member_sort_order',
                'compare' => 'NOT EXISTS',
            ],
        ]);
        $query->set( 'meta_key', '_team_member_sort_order' );
        $query->set( 'orderby', 'meta_value_num' );
        $query->set( 'order', 'ASC' );
    }
});