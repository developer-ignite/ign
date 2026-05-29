import { registerBlockType } from "@wordpress/blocks";
import metadata from "./block.json";
import edit from "./QuickNavigation";
import { save } from "@taktdev/utilities";
import { ReactComponent as blockIcon } from "./QuickNavigation.svg";

registerBlockType(metadata.name, {
	icon: { src: blockIcon },
	edit,
	save
});
