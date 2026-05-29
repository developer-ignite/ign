import { registerBlockType } from "@wordpress/blocks";
import { save } from "@taktdev/utilities";
import metadata from "./block.json";
import edit from "./LinkWithDetails";
import { ReactComponent as blockIcon } from "./LinkWithDetails.svg";

registerBlockType(metadata.name, {
	icon: { src: blockIcon },
	edit,
	save
});
