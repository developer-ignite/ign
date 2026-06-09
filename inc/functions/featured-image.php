<?php

function theme_register_featured_image_meta(){
  $meta = [
    "focal_point" => [
      'type' => 'object',
      'show_in_rest' => [
        'schema' => [
          'type' => 'object',
          'properties' => [
            'x' => [
              'type' => 'number',
              'default' => 0.5,
            ],
            'y' => [
              'type' => 'number',
              'default' => 0.5,
            ],
          ]
        ]
      ]
    ],
    "_thumbnail_id" => [
      'type' => 'integer',
      'show_in_rest' => [
        'schema' => [
            'type' => [ 'integer', 'null' ],
        ],
    ],
    ],
  ];

  theme_register_post_type_meta('post', $meta);
  theme_register_post_type_meta('team_member', $meta);
}
add_action('init', 'theme_register_featured_image_meta');

function theme_disable_post_thumbnail(){
  remove_post_type_support('post', 'thumbnail');
}
add_action('init', 'theme_disable_post_thumbnail');

add_filter( 'jpeg_quality', fn() => 90 );
add_filter( 'wp_editor_set_quality', fn() => 90 );
