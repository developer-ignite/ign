import { registerBlockType } from "@wordpress/blocks";
import { save } from "@taktdev/utilities";
import metadata from "./block.json";
import edit from "./GalleryCarousel";
import { ReactComponent as blockIcon } from "./GalleryCarousel.svg";

registerBlockType(metadata.name, {
	icon: { src: blockIcon },
	edit,
	save
});
