import { registerBlockType } from "@wordpress/blocks";
import { save } from "@taktdev/utilities";
import metadata from "./block.json";
import edit from "./TestimonialsCarousel";
import { ReactComponent as blockIcon } from "./TestimonialsCarousel.svg";

registerBlockType(metadata.name, {
	icon: { src: blockIcon },
	edit,
	save
});
