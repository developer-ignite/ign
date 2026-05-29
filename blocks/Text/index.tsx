import { registerBlockType } from "@wordpress/blocks";
import metadata from "./block.json";
import edit from "./Text";
import { saveInnerBlocks } from "@taktdev/utilities";
import { ReactComponent as blockIcon } from "./Text.svg";

registerBlockType(metadata.name, {
	icon: { src: blockIcon },
	edit,
	save: saveInnerBlocks
});
