<?php

function theme_register_team_member_role_taxonomy() {
  $labels = [
    'name'              => __('Roles', 'takt'),
    'singular_name'     => __('Role', 'takt'),
    'search_items'      => __('Search Roles', 'takt'),
    'all_items'         => __('All Roles', 'takt'),
    'parent_item'       => __('Parent Role', 'takt'),
    'parent_item_colon' => __('Parent Role:', 'takt'),
    'edit_item'         => __('Edit Role', 'takt'),
    'update_item'       => __('Update Role', 'takt'),
    'add_new_item'      => __('Add New Role', 'takt'),
    'new_item_name'     => __('New Role Name', 'takt'),
    'menu_name'         => __('Roles', 'takt'),
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

  register_taxonomy('team_member_role', ['team_member'], $args);
}
add_action('init', 'theme_register_team_member_role_taxonomy');
