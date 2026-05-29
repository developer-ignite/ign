import { registerBlockType } from "@wordpress/blocks";
import metadata from "./block.json";
import edit from "./QuickLinks";
import { save } from "@taktdev/utilities";
import { ReactComponent as blockIcon } from "./QuickLinks.svg";

registerBlockType(metadata.name, {
	icon: { src: blockIcon },
	edit,
	save
});
