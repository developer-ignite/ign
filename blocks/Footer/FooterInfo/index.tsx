import { registerBlockType } from "@wordpress/blocks";
import { save } from "@taktdev/utilities";
import metadata from "./block.json";
import edit from "./FooterInfo";
import { ReactComponent as blockIcon } from "./FooterInfo.svg";

registerBlockType(metadata.name, {
	icon: { src: blockIcon },
	edit,
	save
});
