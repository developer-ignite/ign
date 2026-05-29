import { registerBlockType } from "@wordpress/blocks";
import { save } from "@taktdev/utilities";
import metadata from "./block.json";
import edit from "./CardsCarousel";
import { ReactComponent as blockIcon } from "./CardsCarousel.svg";

registerBlockType(metadata.name, {
	icon: { src: blockIcon },
	edit,
	save
});
