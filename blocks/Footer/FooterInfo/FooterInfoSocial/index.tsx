import { registerBlockType } from "@wordpress/blocks";
import { save } from "@taktdev/utilities";
import metadata from "./block.json";
import edit from "./FooterInfoSocial";
import { ReactComponent as blockIcon } from "./FooterInfoSocial.svg";

registerBlockType(metadata.name, {
	icon: { src: blockIcon },
	edit,
	save
});
