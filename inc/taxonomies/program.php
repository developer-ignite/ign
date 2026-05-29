<?php

function theme_register_program_taxonomy() {
  $labels = [
    'name'              => __('Programs', 'takt'),
    'singular_name'     => __('Program', 'takt'),
    'search_items'      => __('Search Programs', 'takt'),
    'all_items'         => __('All Programs', 'takt'),
    'parent_item'       => __('Parent Program', 'takt'),
    'parent_item_colon' => __('Parent Program:', 'takt'),
    'edit_item'         => __('Edit Program', 'takt'),
    'update_item'       => __('Update Program', 'takt'),
    'add_new_item'      => __('Add New Program', 'takt'),
    'new_item_name'     => __('New Program Name', 'takt'),
    'menu_name'         => __('Programs', 'takt'),
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

  register_taxonomy('program', ['testimonial'], $args);
}
add_action('init', 'theme_register_program_taxonomy');
