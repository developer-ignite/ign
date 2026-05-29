import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";
import { save, removeInnerBlockSettings, addButtonToBlock } from "@taktdev/utilities";
import metadata from "./block.json";
import edit from "./QuickLinkItem";
import { ReactComponent as blockIcon } from "./QuickLinkItem.svg";

removeInnerBlockSettings("takt/quick-link-item");
addButtonToBlock("takt/quick-link-item", __("Quick Link Settings", "takt"));

registerBlockType(metadata.name, {
	icon: { src: blockIcon },
	edit,
	save
});
