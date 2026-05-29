Create a new block type named Search. 

This is the desktop figma design: https://www.figma.com/design/bpRK9A1l2nTbWfMg1pX5yK/IGN-%7C-WEBSITE--INTERNAL-?node-id=678-33982&m=dev

It should be based on the block type /var/www/ign/wp-content/themes/ign/.taktician/instructions/block-types/post-type-archive.md

Also consider the block /var/www/ign/wp-content/themes/ign/blocks/Archive 

The block should have the option to choose between a load more button or to display pagination

The block should have an option to display the filters or not

The block should have an option to display the show N per page or not

The block title and the search placeholder should be editable

The style for the pagination should be applied to the default wordpress pagination on the theme


THE INSTRUCTIONS BELOW SHOULD OVERRIDE THE DESIGN:
- the search bar should be on its own row
- the filter by button will filter by the post type, it should be below the search bar
- the filter should show all the searcheable public post types
- the filters should be displayed on a new line, like the Archive block
- on the post card:
  - do not include a breadcrumb
  - the pill with the post type of the result will follow the page accent color
  - you should display the title of the post below the post type (this is not represented in the design)
  - below the title it should display the excerpt
  - below the excerpt it should display the learn more button
  - the post card should have the same shape as in the design, 1 post per line
- the learn more or pagination should be center aligned
- the "show N per page" should be at the top, on the same line as the filter