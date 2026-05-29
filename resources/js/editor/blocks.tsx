import { addFilter } from "@wordpress/hooks";
import domReady from "@wordpress/dom-ready";
import { getBlockTypes, unregisterBlockType } from "@wordpress/blocks";

const coreBlocks = [
	"core/paragraph",
	"core/heading",
	"core/quote",
	"core/list",
	"core/list-item",
	"core/image",
	"core/html",
	"core/freeform",
	"core/table",
	"core/gallery",
	"core/audio",
	"core/columns",
	"core/group",
	"core/spacer"
];

addFilter(
	"blocks.registerBlockType",
	"takt/move-core-blocks-to-takt-selected",
	(settings, name) => {
		if (coreBlocks.includes(name)) {
			return {
				...settings,
				category: "takt-selected"
			};
		}
		return settings;
	}
);

domReady(() => {
	const legacyBlocks = getBlockTypes().filter((block) => (block.apiVersion || 1) < 3);

	legacyBlocks.forEach((block) => {
		try {
			unregisterBlockType(block.name);
		} catch (e) {
			// ignore errors
		}
	});
});
