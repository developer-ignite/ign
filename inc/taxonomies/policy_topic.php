<?php

function theme_register_policy_topic_taxonomy() {
  $labels = [
    'name'              => __('Topics', 'takt'),
    'singular_name'     => __('Topic', 'takt'),
    'search_items'      => __('Search Topics', 'takt'),
    'all_items'         => __('All Topics', 'takt'),
    'parent_item'       => __('Parent Topic', 'takt'),
    'parent_item_colon' => __('Parent Topic:', 'takt'),
    'edit_item'         => __('Edit Topic', 'takt'),
    'update_item'       => __('Update Topic', 'takt'),
    'add_new_item'      => __('Add New Topic', 'takt'),
    'new_item_name'     => __('New Topic Name', 'takt'),
    'menu_name'         => __('Topics', 'takt'),
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

  register_taxonomy('policy_topic', ['policy'], $args);
}
add_action('init', 'theme_register_policy_topic_taxonomy');
