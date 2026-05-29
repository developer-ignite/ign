Create a Masonry Cards block.

Use https://www.figma.com/design/bpRK9A1l2nTbWfMg1pX5yK/IGN-%7C-WEBSITE--INTERNAL-?node-id=785-34519&m=dev&focus-id=785-34519 for the desktop design.

Use https://www.figma.com/design/bpRK9A1l2nTbWfMg1pX5yK/IGN-%7C-WEBSITE--INTERNAL-?node-id=785-34692&m=dev for the mobile design.

There should be an option to choose how many columns it's going to have, from 2 to 4. On mobile it should always display 1 column. On tablets it should always display 2. On desktop it can display up to 3 or 4 depending on the settings.

There should be an option to choose if the rows will be aligned or not. If they aren't aligned odd columns should have the first row cards taller than the the next column, while even columns should have the second row cards taller than the previous column. Use CSS grid!

Each card will be an inner block. Cards should have the accent color as background. Each card should have a minimum height of 256px.

There is going to have two types of cards: text or image.

Text cards title size will depend on the text length and the amount of characters, so if the text is long it should use a smaller font. It should also have the option to make it taller, in which case it will use the height of two rows, with the title in one row and the content in other. The split of the two rounded-border squares should still follow the misalignmed if that option is enabled.

The image block should have the same authoring experience than the block type content with media. But in this case it will only support images.