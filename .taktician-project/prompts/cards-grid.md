Create a block called Cards Grid.

This is the desktop design: https://www.figma.com/design/bpRK9A1l2nTbWfMg1pX5yK/IGN-%7C-WEBSITE--INTERNAL-?node-id=811-58775&m=dev
This is the mobile design: https://www.figma.com/design/bpRK9A1l2nTbWfMg1pX5yK/IGN-%7C-WEBSITE--INTERNAL-?node-id=811-59472&m=dev

Each card should be an inner block and their background be the accent color.

Check /var/www/ign/wp-content/themes/ign/blocks/ContentWithMedia for the dark mode implementation. When in dark mode the top/bottom padding should be 96px (or similar) on tablets and up.

The inner card should use the tertiary button. Add the arrow to the tertiary button on themebutton. The button component has a parameter to inject content after the text, use it to inject the arrow.

There should be an option to define how many columns the grid is going to have: 1, 2, or 3. On mobile it will have just 1 column, on tablets it will have up to 2 columns. All columns should have the same height.

The only type of media allowed in it is going to be images and if not added their rectangle won't show up.