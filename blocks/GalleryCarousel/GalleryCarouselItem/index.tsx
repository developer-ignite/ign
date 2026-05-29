import { registerBlockType } from "@wordpress/blocks";
import { save } from "@taktdev/utilities";
import metadata from "./block.json";
import edit from "./GalleryCarouselItem";
import { ReactComponent as blockIcon } from "./GalleryCarouselItem.svg";

registerBlockType(metadata.name, {
	icon: { src: blockIcon },
	edit,
	save
});
