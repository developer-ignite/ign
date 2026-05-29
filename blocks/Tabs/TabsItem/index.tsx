import { registerBlockType } from "@wordpress/blocks";
import { save } from "@taktdev/utilities";
import metadata from "./block.json";
import edit from "./TabsItem";
import { ReactComponent as blockIcon } from "./TabsItem.svg";

registerBlockType(metadata.name, {
	icon: { src: blockIcon },
	edit,
	save
});
