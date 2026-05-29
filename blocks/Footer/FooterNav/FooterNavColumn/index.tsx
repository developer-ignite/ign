import { registerBlockType } from "@wordpress/blocks";
import { save } from "@taktdev/utilities";
import metadata from "./block.json";
import edit from "./FooterNavColumn";
import { ReactComponent as blockIcon } from "./FooterNavColumn.svg";

registerBlockType(metadata.name, {
	icon: { src: blockIcon },
	edit,
	save
});
