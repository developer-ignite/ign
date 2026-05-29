import { registerBlockType } from "@wordpress/blocks";
import metadata from "./block.json";
import edit from "./TextCard";
import { save } from "@taktdev/utilities";
import { ReactComponent as blockIcon } from "./TextCard.svg";

registerBlockType(metadata.name, {
	icon: {
		src: blockIcon
	},
	edit,
	save
});
