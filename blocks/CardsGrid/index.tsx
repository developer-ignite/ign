import { registerBlockType } from "@wordpress/blocks";
import { save } from "@taktdev/utilities";
import metadata from "./block.json";
import Edit from "./CardsGrid";
import { ReactComponent as blockIcon } from "./CardsGrid.svg";

registerBlockType(metadata.name, {
	icon: { src: blockIcon },
	edit: Edit,
	save
});
