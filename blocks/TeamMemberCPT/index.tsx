import { registerBlockType } from "@wordpress/blocks";
import { save } from "@taktdev/utilities";
import metadata from "./block.json";
import edit from "./TeamMemberCPT";
import { ReactComponent as blockIcon } from "./TeamMemberCPT.svg";

registerBlockType(metadata.name, {
	icon: { src: blockIcon },
	edit,
	save
});
