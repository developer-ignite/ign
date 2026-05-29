import { registerBlockType } from "@wordpress/blocks";
import { save } from "@taktdev/utilities";
import metadata from "./block.json";
import edit from "./FeaturedPost";
import { ReactComponent as blockIcon } from "./FeaturedPost.svg";

registerBlockType(metadata.name, {
	icon: { src: blockIcon },
	edit,
	save
});
