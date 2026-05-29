<?php

function theme_register_audience_taxonomy() {
  $labels = [
    'name'              => __('Audiences', 'takt'),
    'singular_name'     => __('Audience', 'takt'),
    'search_items'      => __('Search Audiences', 'takt'),
    'all_items'         => __('All Audiences', 'takt'),
    'parent_item'       => __('Parent Audience', 'takt'),
    'parent_item_colon' => __('Parent Audience:', 'takt'),
    'edit_item'         => __('Edit Audience', 'takt'),
    'update_item'       => __('Update Audience', 'takt'),
    'add_new_item'      => __('Add New Audience', 'takt'),
    'new_item_name'     => __('New Audience Name', 'takt'),
    'menu_name'         => __('Audiences', 'takt'),
  ];

  $args = [
    'labels'            => $labels,
    'public'            => false,
    'hierarchical'      => true,
    'show_ui'           => true,
    'show_in_nav_menus' => false,
    'show_admin_column' => true,
    'query_var'         => false,
    'rewrite'           => false,
    'show_tagcloud'     => false,
    'show_in_rest'      => true,
  ];

  register_taxonomy('audience', ['resource'], $args);
}
add_action('init', 'theme_register_audience_taxonomy');
