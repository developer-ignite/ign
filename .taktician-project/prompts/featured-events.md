Create a block named Featured Events.

It should be based on:
/var/www/ign/wp-content/themes/ign/.taktician/instructions/block-types-patterns/dynamic-content-carousel.md
/var/www/ign/wp-content/themes/ign/.taktician/instructions/block-types-patterns/featured-post.md

Figma design: https://www.figma.com/design/bpRK9A1l2nTbWfMg1pX5yK/IGN-%7C-WEBSITE--INTERNAL-?node-id=1215-17607&m=dev

The Events post type is the one created by the plugin The Events Calendar.

The events can be selected manually or automatically. In case of automatic selection, besides the basic filtering by taxonomies, it should also allow for choosing if it's going to show future or past events. If future events it should order ASC, with the closest events first. If past events it should order DESC, with the latest events first.

It should allow for more than one event, in that case it will show one below the other.

The dark background will always be present.