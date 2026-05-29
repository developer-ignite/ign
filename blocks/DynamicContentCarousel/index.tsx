import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";
import { save } from "@taktdev/utilities";
import metadata from "./block.json";
import edit from "./DynamicContentCarousel";
import { ReactComponent as blockIcon } from "./DynamicContentCarousel.svg";
import { ReactComponent as IconPost } from "./DynamicContentCarouselPost.svg";
import { ReactComponent as IconTeamMember } from "./DynamicContentCarouselTeamMember.svg";
import { ReactComponent as IconResource } from "./DynamicContentCarouselResource.svg";
import { ReactComponent as IconPolicy } from "./DynamicContentCarouselPolicy.svg";

registerBlockType(metadata.name, {
	icon: { src: blockIcon },
	edit,
	save,
	variations: [
		{
			name: "post",
			title: __("Blog Carousel", "takt"),
			description: __("Displays a carousel of blog posts", "takt"),
			icon: { src: IconPost },
			attributes: { postsType: "post" },
			isActive: ["postsType"],
			scope: ["inserter", "transform"],
			isDefault: true
		},
		{
			name: "team_member",
			title: __("Team Members Carousel", "takt"),
			description: __("Displays a carousel of team members", "takt"),
			icon: { src: IconTeamMember },
			attributes: { postsType: "team_member" },
			isActive: ["postsType"],
			scope: ["inserter", "transform"]
		},
		{
			name: "resource",
			title: __("Resources Carousel", "takt"),
			description: __("Displays a carousel of resources", "takt"),
			icon: { src: IconResource },
			attributes: { postsType: "resource" },
			isActive: ["postsType"],
			scope: ["inserter", "transform"]
		},
		{
			name: "policy",
			title: __("Policies Carousel", "takt"),
			description: __("Displays a carousel of policies", "takt"),
			icon: { src: IconPolicy },
			attributes: { postsType: "policy" },
			isActive: ["postsType"],
			scope: ["inserter", "transform"]
		}
	]
});
