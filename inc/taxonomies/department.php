<?php

function theme_register_department_taxonomy() {
  $labels = [
    'name'              => __('Departments', 'takt'),
    'singular_name'     => __('Department', 'takt'),
    'search_items'      => __('Search Departments', 'takt'),
    'all_items'         => __('All Departments', 'takt'),
    'parent_item'       => __('Parent Department', 'takt'),
    'parent_item_colon' => __('Parent Department:', 'takt'),
    'edit_item'         => __('Edit Department', 'takt'),
    'update_item'       => __('Update Department', 'takt'),
    'add_new_item'      => __('Add New Department', 'takt'),
    'new_item_name'     => __('New Department Name', 'takt'),
    'menu_name'         => __('Departments', 'takt'),
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

  register_taxonomy('department', ['team_member'], $args);
}
add_action('init', 'theme_register_department_taxonomy');
