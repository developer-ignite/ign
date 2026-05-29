Create a new block named Hero. It will have two variations, primary hero and secondary hero.

Use /var/www/ign/wp-content/themes/ign/.taktician/instructions/block-types/hero.md for instructions.

The primary version desktop layout is: https://www.figma.com/design/bpRK9A1l2nTbWfMg1pX5yK/IGN-%7C-WEBSITE--INTERNAL-?node-id=785-51426&m=dev
And its mobile version is: https://www.figma.com/design/bpRK9A1l2nTbWfMg1pX5yK/IGN-%7C-WEBSITE--INTERNAL-?node-id=785-52057&m=dev

The secondary version desktop layout is: https://www.figma.com/design/bpRK9A1l2nTbWfMg1pX5yK/IGN-%7C-WEBSITE--INTERNAL-?node-id=785-50945&m=dev
And its mobile version is: https://www.figma.com/design/bpRK9A1l2nTbWfMg1pX5yK/IGN-%7C-WEBSITE--INTERNAL-?node-id=785-52116&m=dev

The site header is not part of the hero, ignore it.

The hero includes a gradient effect. You can use this as an starting point for that effect:

```css
.dark {
  --gradient-main: var(--color-charcoal);
  --gradient-circle-left: var(--color-charcoal);
  --gradient-circle-right: var(--color-charcoal);
}

.neon-green {
  --gradient-main: var(--color-neon-green);
  --gradient-circle-left: var(--color-neon-green);
  --gradient-circle-right: var(--color-blue);
}

.blue {
  --gradient-main: var(--color-blue);
  --gradient-circle-left: var(--color-blue);
  --gradient-circle-right: var(--color-neon-green);
}

.green {
  --gradient-main: var(--color-green);
  --gradient-circle-left: var(--color-green);
  --gradient-circle-right: var(--color-blue);
}

.yellow {
  --gradient-main: var(--color-yellow);
  --gradient-circle-left: var(--color-yellow);
  --gradient-circle-right: var(--color-orange);
}

.orange {
  --gradient-main: var(--color-orange);
  --gradient-circle-left: var(--color-orange);
  --gradient-circle-right: var(--color-yellow);
}

.purple {
  --gradient-main: var(--color-purple);
  --gradient-circle-left: var(--color-purple);
  --gradient-circle-right: var(--color-blue);
}

.gradient{
  @apply absolute top-0 left-0 w-full h-[150vw] -z-12;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--gradient-main) 60%, transparent) 25%, color-mix(in srgb, var(--color-off-white) 60%, transparent) 80%, transparent),
    radial-gradient(
      ellipse 30% 44% at 20% 45%,
      var(--gradient-circle-left),
      transparent
    ),
    radial-gradient(
      ellipse 44% 33% at 80% 30%,
      var(--gradient-circle-right),
      transparent
    )
  ;
}
```

The color will come from the page accent color, you just need to include the appropriate styles. Ideally scope the variables above so they only show up on the hero.

Apply a mask to the media, so it progressively reveals the gradient below it. The gradient should extend beyond the block size.

For the primary version there is going to be an area for inner blocks, with the quick navigation block. That area can be enabled or disabled. The quick navigation block is mandatory, use the requireBlock() function to make it mandatory. Also there can only be one block of it in the hero (use uniqueBlock() for such).

The quick navigation block is this part of the figma design: https://www.figma.com/design/bpRK9A1l2nTbWfMg1pX5yK/IGN-%7C-WEBSITE--INTERNAL-?node-id=785-51438&m=dev . And this is its mobile version: https://www.figma.com/design/bpRK9A1l2nTbWfMg1pX5yK/IGN-%7C-WEBSITE--INTERNAL-?node-id=785-52095&m=dev

The quick navigation needs to have an editable title, an editable list of pages, and a submit button that once pressed will redirect the user to the selected page. Implement the best way of making this editable list of pages, can be inner blocks, can be selecting a menu, or other approach. You are free to pick whatever you think it's best but justify it.
