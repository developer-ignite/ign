import { registerBlockType } from "@wordpress/blocks";
import metadata from "./block.json";
import edit from "./Search";
import { save } from "@taktdev/utilities";
import { ReactComponent as blockIcon } from "./Search.svg";

registerBlockType(metadata.name, {
	icon: { src: blockIcon },
	edit,
	save
});
