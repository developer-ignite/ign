Create a block called Post Hero.

This is the desktop figma design: https://www.figma.com/design/bpRK9A1l2nTbWfMg1pX5yK/IGN-%7C-WEBSITE--INTERNAL-?node-id=669-33688&m=dev

It will be based on the block type /var/www/ign/wp-content/themes/ign/.taktician/instructions/block-types/hero.md and the secondary variation of the block /var/www/ign/wp-content/themes/ign/.taktician-project/reports/blocks/hero

It should automatically get the post thumbnail for the background, the post topic for the pill (that needs to have the topic color), the post title for the title, make it an option to display the excerpt below the title or not, then the author and publish date (following the format defined in wp settings).

By default it should use the page accent color but it should have an option to use the topic accent color. In that case it will use the accent color of the first topic fetched on the post.