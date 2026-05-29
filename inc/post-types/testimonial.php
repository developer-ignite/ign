<?php

function theme_register_testimonial_post_type() {
  register_post_type('testimonial', [
    'label' => __('Testimonial', 'takt'),
    'labels' => [
      'name'                  => __('Testimonials', 'takt'),
      'singular_name'         => __('Testimonial', 'takt'),
      'add_new'               => __('Add New', 'takt'),
      'add_new_item'          => __('Add New Testimonial', 'takt'),
      'edit_item'             => __('Edit Testimonial', 'takt'),
      'new_item'              => __('New Testimonial', 'takt'),
      'view_item'             => __('View Testimonial', 'takt'),
      'view_items'            => __('View Testimonials', 'takt'),
      'search_items'          => __('Search Testimonials', 'takt'),
      'not_found'             => __('No Testimonials found', 'takt'),
      'not_found_in_trash'    => __('No Testimonials found in Trash', 'takt'),
      'parent_item_colon'     => __('Parent Testimonial:', 'takt'),
      'all_items'             => __('All Testimonials', 'takt'),
      'archives'              => __('Testimonial Archives', 'takt'),
      'attributes'            => __('Testimonial Attributes', 'takt'),
      'insert_into_item'      => __('Insert into Testimonial', 'takt'),
      'uploaded_to_this_item' => __('Uploaded to this Testimonial', 'takt'),
      'featured_image'        => __('Featured Image', 'takt'),
      'set_featured_image'    => __('Set featured image', 'takt'),
      'remove_featured_image' => __('Remove featured image', 'takt'),
      'use_featured_image'    => __('Use as featured image', 'takt'),
      'menu_name'             => __('Testimonials', 'takt'),
      'filter_items_list'     => __('Filter Testimonials list', 'takt'),
      'items_list_navigation' => __('Testimonials list navigation', 'takt'),
      'items_list'            => __('Testimonials list', 'takt'),
      'name_admin_bar'        => __('Testimonial', 'takt'),
    ],
    'description'         => '',
    'public'              => false,
    'exclude_from_search' => true,
    'publicly_queryable'  => false,
    'show_ui'             => true,
    'show_in_nav_menus'   => false,
    'show_in_menu'        => true,
    'show_in_admin_bar'   => true,
    'menu_position'       => 6,
    'menu_icon'           => 'dashicons-format-chat',
    'capability_type'     => 'post',
    'hierarchical'        => false,
    'supports'            => ['title', 'editor', 'revisions', 'custom-fields'],
    'taxonomies'          => [],
    'has_archive'         => false,
    'rewrite'             => false,
    'query_var'           => false,
    'can_export'          => true,
    'delete_with_user'    => null,
    'show_in_rest'        => true,
    'template'            => [
      [ 'takt/testimonial-cpt' ],
    ],
    'template_lock'       => 'all',
  ]);
}
add_action('init', 'theme_register_testimonial_post_type');

function theme_register_testimonial_meta() {
  $meta = [
    "name",
    "message",
    "accent_color",
    "videoSource" => [
      'default' => 'file',
    ],
    "videoFile" => [
      'type' => 'integer',
    ],
    "videoId",
  ];

  theme_register_post_type_meta('testimonial', $meta);
}
add_action('init', 'theme_register_testimonial_meta');
