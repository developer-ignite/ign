import { registerBlockType } from "@wordpress/blocks";
import { save } from "@taktdev/utilities";
import metadata from "./block.json";
import edit from "./Header";
import { ReactComponent as blockIcon } from "./Header.svg";

registerBlockType(metadata.name, {
	icon: { src: blockIcon },
	edit,
	save
});
