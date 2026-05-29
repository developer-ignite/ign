import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";
import { save } from "@taktdev/utilities";
import metadata from "./block.json";
import edit from "./Accordion";
import { ReactComponent as blockIcon } from "./Accordion.svg";
import { ReactComponent as AccordionWithMedia } from "./AccordionWithMedia.svg";

registerBlockType(metadata.name, {
	icon: { src: blockIcon },
	edit,
	save,
	variations: [
		{
			name: "default",
			title: __("Accordion", "takt"),
			description: __(
				"Displays eyebrow, title, description, and buttons on one side and accordions on the other.",
				"takt"
			),
			icon: { src: blockIcon },
			attributes: { blockVariation: "default" },
			isActive: (blockAttributes) =>
				blockAttributes.blockVariation === "default" || !blockAttributes.blockVariation,
			scope: ["inserter", "transform"],
			isDefault: true
		},
		{
			name: "with-media",
			title: __("Accordion with Media", "takt"),
			description: __("Accordion with an image on the left side.", "takt"),
			icon: { src: AccordionWithMedia },
			attributes: { blockVariation: "with-media" },
			isActive: (blockAttributes) => blockAttributes.blockVariation === "with-media",
			scope: ["inserter", "transform"]
		}
	]
});
