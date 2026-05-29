<?php

function theme_register_resource_type_taxonomy() {
  $labels = [
    'name'              => __('Resource Types', 'takt'),
    'singular_name'     => __('Resource Type', 'takt'),
    'search_items'      => __('Search Resource Types', 'takt'),
    'all_items'         => __('All Resource Types', 'takt'),
    'parent_item'       => __('Parent Resource Type', 'takt'),
    'parent_item_colon' => __('Parent Resource Type:', 'takt'),
    'edit_item'         => __('Edit Resource Type', 'takt'),
    'update_item'       => __('Update Resource Type', 'takt'),
    'add_new_item'      => __('Add New Resource Type', 'takt'),
    'new_item_name'     => __('New Resource Type Name', 'takt'),
    'menu_name'         => __('Resource Types', 'takt'),
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

  register_taxonomy('resource_type', ['resource'], $args);
}
add_action('init', 'theme_register_resource_type_taxonomy');
