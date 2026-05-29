import { registerBlockType } from "@wordpress/blocks";
import { save } from "@taktdev/utilities";
import metadata from "./block.json";
import edit from "./HeaderItem";
import { ReactComponent as blockIcon } from "./HeaderItem.svg";

registerBlockType(metadata.name, {
	icon: { src: blockIcon },
	edit,
	save
});
