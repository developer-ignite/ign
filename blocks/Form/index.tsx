import { registerBlockType } from "@wordpress/blocks";
import { save } from "@taktdev/utilities";
import metadata from "./block.json";
import edit from "./Form";
import { ReactComponent as blockIcon } from "./Form.svg";

registerBlockType(metadata.name, {
	icon: { src: blockIcon },
	edit,
	save
});
