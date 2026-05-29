import { registerBlockType } from "@wordpress/blocks";
import metadata from "./block.json";
import edit from "./WideSocialMediaItem";
import { save } from "@taktdev/utilities";
import { ReactComponent as blockIcon } from "./WideSocialMediaItem.svg";

registerBlockType(metadata.name, {
	icon: { src: blockIcon },
	edit,
	save
});
