import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";
import metadata from "./block.json";
import edit from "./Archive";
import { save } from "@taktdev/utilities";
import { ReactComponent as blockIcon } from "./Archive.svg";
import { ReactComponent as IconPost } from "./ArchivePost.svg";
import { ReactComponent as IconTeamMember } from "./ArchiveTeamMember.svg";
import { ReactComponent as IconResource } from "./ArchiveResource.svg";
import { ReactComponent as IconPolicy } from "./ArchivePolicy.svg";

registerBlockType(metadata.name, {
	icon: { src: blockIcon },
	edit,
	save,
	variations: [
		{
			name: "post",
			title: __("Blog Archive", "takt"),
			description: __("Displays a filterable archive of blog posts", "takt"),
			icon: { src: IconPost },
			attributes: { blockVariation: "post", maxColumns: 4, postsPerPage: 10 },
			isActive: ["blockVariation"],
			scope: ["inserter", "transform"],
			isDefault: true
		},
		{
			name: "team_member",
			title: __("Team Members Archive", "takt"),
			description: __("Displays a filterable archive of team members", "takt"),
			icon: { src: IconTeamMember },
			attributes: { blockVariation: "team_member" },
			isActive: ["blockVariation"],
			scope: ["inserter", "transform"]
		},
		{
			name: "resource",
			title: __("Resources Archive", "takt"),
			description: __("Displays a filterable archive of resources", "takt"),
			icon: { src: IconResource },
			attributes: { blockVariation: "resource" },
			isActive: ["blockVariation"],
			scope: ["inserter", "transform"]
		},
		{
			name: "policy",
			title: __("Policies Archive", "takt"),
			description: __("Displays a filterable archive of policies", "takt"),
			icon: { src: IconPolicy },
			attributes: { blockVariation: "policy" },
			isActive: ["blockVariation"],
			scope: ["inserter", "transform"]
		}
	]
});
