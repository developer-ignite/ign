import { registerBlockType } from "@wordpress/blocks";
import metadata from "./block.json";
import edit from "./ImageCard";
import { save } from "@taktdev/utilities";
import { ReactComponent as blockIcon } from "./ImageCard.svg";

registerBlockType(metadata.name, {
	icon: {
		src: blockIcon
	},
	edit,
	save
});
