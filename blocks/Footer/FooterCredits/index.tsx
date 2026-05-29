import { registerBlockType } from "@wordpress/blocks";
import { save } from "@taktdev/utilities";
import metadata from "./block.json";
import edit from "./FooterCredits";
import { ReactComponent as blockIcon } from "./FooterCredits.svg";

registerBlockType(metadata.name, {
	icon: { src: blockIcon },
	edit,
	save
});
