import { registerBlockType } from "@wordpress/blocks";
import metadata from "./block.json";
import edit from "./DemoContainer";
import { save } from "@taktdev/utilities";
import { ReactComponent as blockIcon } from "./DemoContainer.svg";

registerBlockType(metadata.name, {
	icon: { src: blockIcon },
	edit,
	save
});
