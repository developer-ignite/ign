import { registerBlockType } from "@wordpress/blocks";
import metadata from "./block.json";
import edit from "./MasonryCards";
import { save } from "@taktdev/utilities";
import { ReactComponent as blockIcon } from "./MasonryCards.svg";

registerBlockType(metadata.name, {
	icon: {
		src: blockIcon
	},
	edit,
	save
});
