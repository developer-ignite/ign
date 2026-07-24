<?php
/**
 * Custom link override for Policies.
 *
 * Lets an editor point a policy's archive/card link at an external URL
 * (e.g. a PDF in wp-content) instead of the policy's own permalink.
 */

add_action( 'add_meta_boxes', function() {
    add_meta_box(
        'policy_custom_link',
        'Custom Link',
        'render_policy_custom_link_meta_box',
        'policy',
        'side',
        'default'
    );
});

function render_policy_custom_link_meta_box( $post ) {
    wp_nonce_field( 'policy_custom_link_nonce', 'policy_custom_link_nonce' );
    $value = get_post_meta( $post->ID, '_policy_custom_link', true );
    $text  = get_post_meta( $post->ID, '_policy_link_text', true );
    echo '<label for="policy_custom_link">Link to (optional)</label>';
    echo '<input type="url" id="policy_custom_link" name="policy_custom_link" value="' . esc_attr( $value ) . '" placeholder="https://..." style="width:100%;margin-top:5px;" />';
    echo '<p class="description">If set, cards for this policy will link here instead of the policy page. Leave blank to use the default policy page link.</p>';

    echo '<label for="policy_link_text" style="display:block;margin-top:15px;">Link text (optional)</label>';
    echo '<input type="text" id="policy_link_text" name="policy_link_text" value="' . esc_attr( $text ) . '" placeholder="View Resource" style="width:100%;margin-top:5px;" />';
    echo '<p class="description">If set, overrides the "View Resource" label on this policy\'s card. Leave blank to use the default.</p>';
}

add_action( 'save_post_policy', function( $post_id ) {
    if (
        ! isset( $_POST['policy_custom_link_nonce'] ) ||
        ! wp_verify_nonce( $_POST['policy_custom_link_nonce'], 'policy_custom_link_nonce' )
    ) return;

    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;
    if ( ! current_user_can( 'edit_post', $post_id ) ) return;

    if ( isset( $_POST['policy_custom_link'] ) ) {
        update_post_meta(
            $post_id,
            '_policy_custom_link',
            esc_url_raw( trim( $_POST['policy_custom_link'] ) )
        );
    }

    if ( isset( $_POST['policy_link_text'] ) ) {
        update_post_meta(
            $post_id,
            '_policy_link_text',
            sanitize_text_field( trim( $_POST['policy_link_text'] ) )
        );
    }
});
