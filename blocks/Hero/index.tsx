import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";
import metadata from "./block.json";
import edit from "./Hero";
import { save } from "@taktdev/utilities";
import { ReactComponent as blockIcon } from "./Hero.svg";
import { ReactComponent as HeroPrimary } from "./HeroPrimary.svg";
import { ReactComponent as HeroSecondary } from "./HeroSecondary.svg";

registerBlockType(metadata.name, {
	icon: { src: blockIcon },
	edit,
	save,
	variations: [
		{
			name: "primary",
			title: __("Hero (Primary)", "takt"),
			description: __("A full-width hero with centered content and quick navigation", "takt"),
			icon: { src: HeroPrimary },
			attributes: { blockVariation: "primary", enableQuickNav: true },
			isActive: ["blockVariation"],
			scope: ["inserter", "transform"],
			isDefault: true
		},
		{
			name: "secondary",
			title: __("Hero (Secondary)", "takt"),
			description: __("A hero with left-aligned content and call-to-action button", "takt"),
			icon: { src: HeroSecondary },
			attributes: { blockVariation: "secondary", enableQuickNav: false },
			isActive: ["blockVariation"],
			scope: ["inserter", "transform"]
		}
	]
});
