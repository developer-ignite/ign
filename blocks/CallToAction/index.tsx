import { registerBlockType } from "@wordpress/blocks";
import { save } from "@taktdev/utilities";
import metadata from "./block.json";
import edit from "./CallToAction";
import { ReactComponent as blockIcon } from "./CallToAction.svg";

registerBlockType(metadata.name, {
	icon: { src: blockIcon },
	edit,
	save
});
