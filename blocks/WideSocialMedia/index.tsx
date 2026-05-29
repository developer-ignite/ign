import { registerBlockType } from "@wordpress/blocks";
import metadata from "./block.json";
import edit from "./WideSocialMedia";
import { save } from "@taktdev/utilities";
import { ReactComponent as blockIcon } from "./WideSocialMedia.svg";

registerBlockType(metadata.name, {
	icon: { src: blockIcon },
	edit,
	save
});
