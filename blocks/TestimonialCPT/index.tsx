import { registerBlockType } from "@wordpress/blocks";
import { save } from "@taktdev/utilities";
import metadata from "./block.json";
import edit from "./TestimonialCPT";
import { ReactComponent as blockIcon } from "./TestimonialCPT.svg";

registerBlockType(metadata.name, {
	icon: { src: blockIcon },
	edit,
	save
});
