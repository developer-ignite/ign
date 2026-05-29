import { registerBlockType } from "@wordpress/blocks";
import { save } from "@taktdev/utilities";
import metadata from "./block.json";
import edit from "./FeaturedEvents";
import { ReactComponent as blockIcon } from "./FeaturedEvents.svg";

registerBlockType(metadata.name, {
	icon: { src: blockIcon },
	edit,
	save
});
