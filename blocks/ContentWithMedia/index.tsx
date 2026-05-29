import { __ } from "@wordpress/i18n";
import { registerBlockType, createBlock } from "@wordpress/blocks";
import { save } from "@taktdev/utilities";
import metadata from "./block.json";
import edit from "./ContentWithMedia";
import { ReactComponent as blockIcon } from "./ContentWithMedia.svg";
import { ReactComponent as ContentWithImage } from "./ContentWithImage.svg";
import { ReactComponent as ContentWithVideo } from "./ContentWithVideo.svg";

registerBlockType(metadata.name, {
	icon: { src: blockIcon },
	edit,
	save,
	deprecated: [
		{
			attributes: {
				...metadata.attributes,
				description: {
					type: "string"
				},
				buttons: {
					type: "array"
				}
			},
			save,
			migrate(oldAttributes: Record<string, unknown>) {
				const { description, buttons, ...newAttributes } = oldAttributes;

				const innerBlocks = [];

				// Convert description to paragraph block
				if (description && typeof description === "string") {
					innerBlocks.push(
						createBlock("core/paragraph", {
							content: description
						})
					);
				}

				// Convert buttons to button-row block
				if (buttons && Array.isArray(buttons) && buttons.length > 0) {
					const buttonBlocks = buttons.map((button) => createBlock("takt/button", { button }));
					innerBlocks.push(createBlock("takt/button-row", {}, buttonBlocks));
				}

				return [newAttributes, innerBlocks];
			}
		}
	],
	variations: [
		{
			name: "image",
			title: __("Content With Image", "takt"),
			description: __("Content on one side with an image collage on the other.", "takt"),
			icon: { src: ContentWithImage },
			attributes: { mediaType: "image" },
			isActive: (blockAttributes) => blockAttributes.mediaType === "image",
			scope: ["inserter", "transform"],
			isDefault: true
		},
		{
			name: "video",
			title: __("Content With Video", "takt"),
			description: __("Content on one side with a video on the other.", "takt"),
			icon: { src: ContentWithVideo },
			attributes: { mediaType: "video" },
			isActive: (blockAttributes) => blockAttributes.mediaType === "video",
			scope: ["inserter", "transform"]
		}
	]
});
