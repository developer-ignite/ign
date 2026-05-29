import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";
import { save } from "@taktdev/utilities";
import metadata from "./block.json";
import edit from "./FullWidthMedia";
import { ReactComponent as blockIcon } from "./FullWidthMedia.svg";
import { ReactComponent as FullWidthImage } from "./FullWidthImage.svg";
import { ReactComponent as FullWidthVideo } from "./FullWidthVideo.svg";

registerBlockType(metadata.name, {
	icon: { src: blockIcon },
	edit,
	save,
	variations: [
		{
			name: "image",
			title: __("Full Width Image", "takt"),
			description: __("Content above a full-width image.", "takt"),
			icon: { src: FullWidthImage },
			attributes: { mediaType: "image" },
			isActive: (blockAttributes) => blockAttributes.mediaType === "image",
			scope: ["inserter", "transform"],
			isDefault: true
		},
		{
			name: "video",
			title: __("Full Width Video", "takt"),
			description: __("Content above a full-width video.", "takt"),
			icon: { src: FullWidthVideo },
			attributes: { mediaType: "video" },
			isActive: (blockAttributes) => blockAttributes.mediaType === "video",
			scope: ["inserter", "transform"]
		}
	]
});
