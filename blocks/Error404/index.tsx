import { registerBlockType } from "@wordpress/blocks";
import { save } from "@taktdev/utilities";
import metadata from "./block.json";
import edit from "./Error404";
import { ReactComponent as blockIcon } from "./Error404.svg";

registerBlockType(metadata.name, {
	icon: { src: blockIcon },
	edit,
	save
});
