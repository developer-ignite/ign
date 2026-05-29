<?php

function theme_register_team_member_post_type() {
  register_post_type('team_member', [
    'label' => __('Team Member', 'takt'),
    'labels' => [
      'name'                  => __('Team Members', 'takt'),
      'singular_name'         => __('Team Member', 'takt'),
      'add_new'               => __('Add New', 'takt'),
      'add_new_item'          => __('Add New Team Member', 'takt'),
      'edit_item'             => __('Edit Team Member', 'takt'),
      'new_item'              => __('New Team Member', 'takt'),
      'view_item'             => __('View Team Member', 'takt'),
      'view_items'            => __('View Team Members', 'takt'),
      'search_items'          => __('Search Team Members', 'takt'),
      'not_found'             => __('No Team Members found', 'takt'),
      'not_found_in_trash'    => __('No Team Members found in Trash', 'takt'),
      'parent_item_colon'     => __('Parent Team Member:', 'takt'),
      'all_items'             => __('All Team Members', 'takt'),
      'archives'              => __('Team Member Archives', 'takt'),
      'attributes'            => __('Team Member Attributes', 'takt'),
      'insert_into_item'      => __('Insert into Team Member', 'takt'),
      'uploaded_to_this_item' => __('Uploaded to this Team Member', 'takt'),
      'featured_image'        => __('Featured Image', 'takt'),
      'set_featured_image'    => __('Set featured image', 'takt'),
      'remove_featured_image' => __('Remove featured image', 'takt'),
      'use_featured_image'    => __('Use as featured image', 'takt'),
      'menu_name'             => __('Team Members', 'takt'),
      'filter_items_list'     => __('Filter Team Members list', 'takt'),
      'items_list_navigation' => __('Team Members list navigation', 'takt'),
      'items_list'            => __('Team Members list', 'takt'),
      'name_admin_bar'        => __('Team Member', 'takt'),
    ],
    'description'         => __('Team members and staff.', 'takt'),
    'public'              => true,
    'exclude_from_search' => false,
    'publicly_queryable'  => false,
    'show_ui'             => true,
    'show_in_nav_menus'   => false,
    'show_in_menu'        => true,
    'show_in_admin_bar'   => true,
    'menu_position'       => 6,
    'menu_icon'           => 'dashicons-groups',
    'capability_type'     => 'post',
    'hierarchical'        => false,
    'supports'            => ['title', 'editor', 'excerpt', 'revisions', 'custom-fields'],
    'taxonomies'          => [],
    'has_archive'         => true,
    'rewrite'             => [
      'slug'       => 'team',
      'with_front' => false,
      'pages'      => true,
      'feeds'      => true,
    ],
    'query_var'       => true,
    'can_export'      => true,
    'delete_with_user' => null,
    'show_in_rest'    => true,
    'template'        => [
      ['takt/team-member-cpt'],
    ],
    'template_lock'   => 'all',
  ]);
}
add_action('init', 'theme_register_team_member_post_type');

function theme_register_team_member_meta() {
  $meta = [
    "first_name",
    "last_name",
    "bio",
    "collapse_bio" => [
      'type'         => 'boolean',
      'default'      => false,
      'show_in_rest' => true,
    ],
    "contact_link" => [
      'type'         => 'object',
      'default'      => [
        'url'           => '',
        'postId'        => null,
        'postType'      => null,
        'opensInNewTab' => true,
        'title'         => '',
        'label'         => '',
      ],
      'show_in_rest' => [
        'schema' => [
          'type'       => 'object',
          'properties' => [
            'url'           => [ 'type' => 'string' ],
            'postId'        => [ 'type' => [ 'integer', 'null' ] ],
            'postType'      => [ 'type' => [ 'string', 'null' ] ],
            'opensInNewTab' => [ 'type' => 'boolean' ],
            'title'         => [ 'type' => 'string' ],
            'label'         => [ 'type' => 'string' ],
          ],
        ],
      ],
    ],
  ];

  theme_register_post_type_meta('team_member', $meta);
}
add_action('init', 'theme_register_team_member_meta');

// --- Custom Admin Columns ---

function theme_team_member_posts_columns($columns) {
  $new_columns = [];
  foreach ($columns as $key => $value) {
    if ($key === 'date') {
      $new_columns['first_name'] = __('First Name', 'takt');
      $new_columns['last_name'] = __('Last Name', 'takt');
    }
    $new_columns[$key] = $value;
  }
  return $new_columns;
}
add_filter('manage_team_member_posts_columns', 'theme_team_member_posts_columns');

function theme_team_member_posts_custom_column($column, $post_id) {
  if ($column === 'first_name') {
    $value = get_post_meta($post_id, 'first_name', true);
    echo esc_html($value);
  }
  if ($column === 'last_name') {
    $value = get_post_meta($post_id, 'last_name', true);
    echo esc_html($value);
  }
}
add_action('manage_team_member_posts_custom_column', 'theme_team_member_posts_custom_column', 10, 2);

function theme_team_member_sortable_columns($columns) {
  $columns['first_name'] = 'first_name';
  $columns['last_name'] = 'last_name';
  return $columns;
}
add_filter('manage_edit-team_member_sortable_columns', 'theme_team_member_sortable_columns');

require_once get_template_directory() . '/inc/post-types/team-member-order.php';