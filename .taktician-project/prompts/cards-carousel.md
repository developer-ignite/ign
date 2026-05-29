Create a block called Cards Carousel.

Use /var/www/ign/wp-content/themes/ign/.taktician/instructions/block-types/cards-carousel.md as the block type.

This is the desktop design: https://www.figma.com/design/bpRK9A1l2nTbWfMg1pX5yK/IGN-%7C-WEBSITE--INTERNAL-?node-id=811-59110&m=dev

Each card should be an inner block and their background be the accent color.

Check /var/www/ign/wp-content/themes/ign/blocks/ContentWithMedia for the dark mode implementation.

The inner card should use the tertiary button. Add the arrow to the tertiary button on themebutton. The button component has a parameter to inject content after the text, use it to inject the arrow.

The circular arrow button with colored background is the hover state. Use the secondary button as an example of how the arrow should look. The svg should only have the arrow, the circle must be done with css.

There should be an option to define how many columns the carousel is going to have, the options are: 1, 2, or 3. On mobile it will have just 1 column, on tablets it will have up to 2 columns.