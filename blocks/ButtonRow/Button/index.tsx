import { registerBlockType } from "@wordpress/blocks";
import metadata from "./block.json";
import edit from "./Button";
import { save } from "@taktdev/utilities";
import { ReactComponent as blockIcon } from "./Button.svg";

registerBlockType(metadata.name, {
	icon: {
		src: blockIcon
	},
	edit,
	save
});
