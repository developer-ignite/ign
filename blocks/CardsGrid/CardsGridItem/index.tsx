import { registerBlockType } from "@wordpress/blocks";
import { save } from "@taktdev/utilities";
import metadata from "./block.json";
import Edit from "./CardsGridItem";
import { ReactComponent as blockIcon } from "./CardsGridItem.svg";

registerBlockType(metadata.name, {
	icon: { src: blockIcon },
	edit: Edit,
	save
});
