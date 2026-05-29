import { registerBlockType } from "@wordpress/blocks";
import { save } from "@taktdev/utilities";
import metadata from "./block.json";
import edit from "./Footer";
import { ReactComponent as blockIcon } from "./Footer.svg";

registerBlockType(metadata.name, {
	icon: { src: blockIcon },
	edit,
	save
});
