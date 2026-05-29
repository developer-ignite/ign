import { registerBlockType } from "@wordpress/blocks";
import { save } from "@taktdev/utilities";
import metadata from "./block.json";
import edit from "./HeaderSubItem";
import { ReactComponent as blockIcon } from "./HeaderSubItem.svg";

registerBlockType(metadata.name, {
	icon: { src: blockIcon },
	edit,
	save
});
