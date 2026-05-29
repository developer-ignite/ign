import { useBlockProps } from "@wordpress/block-editor";
import { Link, IconPicker, SuggestedIcon } from "@taktdev/components";
import { renameBlock, cn } from "@taktdev/utilities";

import { ReactComponent as IconBluesky } from "./resources/icon-bluesky.svg";
import { ReactComponent as IconFacebookAlt } from "./resources/icon-facebook-alt.svg";
import { ReactComponent as IconFacebook } from "./resources/icon-facebook.svg";
import { ReactComponent as IconImdb } from "./resources/icon-imdb.svg";
import { ReactComponent as IconInstagram } from "./resources/icon-instagram.svg";
import { ReactComponent as IconLinkedin } from "./resources/icon-linkedin.svg";
import { ReactComponent as IconPinterest } from "./resources/icon-pinterest.svg";
import { ReactComponent as IconThreads } from "./resources/icon-threads.svg";
import { ReactComponent as IconTiktok } from "./resources/icon-tiktok.svg";
import { ReactComponent as IconVimeo } from "./resources/icon-vimeo.svg";
import { ReactComponent as IconX } from "./resources/icon-x.svg";
import { ReactComponent as IconYoutube } from "./resources/icon-youtube.svg";

const suggestedIcons: SuggestedIcon[] = [
	{ name: "bluesky", label: "Bluesky", icon: IconBluesky },
	{ name: "facebook", label: "Facebook", icon: IconFacebook },
	{ name: "facebook-alt", label: "Facebook", icon: IconFacebookAlt },
	{ name: "imdb", label: "IMDb", icon: IconImdb },
	{ name: "instagram", label: "Instagram", icon: IconInstagram },
	{ name: "linkedin", label: "LinkedIn", icon: IconLinkedin },
	{ name: "pinterest", label: "Pinterest", icon: IconPinterest },
	{ name: "threads", label: "Threads", icon: IconThreads },
	{ name: "tiktok", label: "TikTok", icon: IconTiktok },
	{ name: "vimeo", label: "Vimeo", icon: IconVimeo },
	{ name: "x", label: "X", icon: IconX },
	{ name: "youtube", label: "YouTube", icon: IconYoutube }
];

type SocialLink = {
	title: string;
	url: string;
	postId?: number;
	postType?: string;
	opensInNewTab: boolean;
	label: string;
};

type FooterInfoSocialItemAttributes = {
	anchor?: string;
	link: SocialLink;
	logoId?: number;
	iconSlug?: string;
};

type EditProps = {
	attributes: FooterInfoSocialItemAttributes;
	setAttributes: (attrs: Partial<FooterInfoSocialItemAttributes>) => void;
	clientId: string;
	isSelected: boolean;
};

export default function Edit({ attributes, setAttributes, clientId, isSelected }: EditProps) {
	const hasIcon = !!(attributes.iconSlug || attributes.logoId);
	let iconPickerValue: { slug: string } | { mediaId: number } | null = null;
	if (attributes.iconSlug) {
		iconPickerValue = { slug: attributes.iconSlug };
	} else if (attributes.logoId) {
		iconPickerValue = { mediaId: attributes.logoId };
	}

	// Static icon for unselected state: find the matching SVG from suggestedIcons
	const staticIcon = attributes.iconSlug
		? suggestedIcons.find((i) => i.name === attributes.iconSlug)
		: null;

	return (
		<li
			{...useBlockProps({
				className: "block list-none not-discourse"
			})}
		>
			<Link
				className={cn({
					"block transition-colors w-6 h-6 no-underline!": true,
					"*:w-6 *:h-6 *:object-contain *:object-center": hasIcon,
					"text-white hover:text-neon-green": true
				})}
				link={attributes.link}
				onChange={(value) => {
					const newLink = { ...attributes.link, ...value };
					renameBlock(newLink.title, attributes.link.title, clientId);
					setAttributes({ link: newLink });
				}}
			>
				{isSelected ? (
					// Only mount IconPicker (which contains MediaUpload) when selected.
					// This prevents store interactions during the block insertion lifecycle.
					<IconPicker
						value={iconPickerValue}
						onChange={(icon) =>
							setAttributes({
								iconSlug: icon?.slug ?? undefined,
								logoId: icon?.mediaId ?? undefined
							})
						}
						suggestedIcons={suggestedIcons}
						iconSize={24}
					/>
				) : (
					// Render icon statically when not selected to avoid MediaUpload on mount.
					<span className="block w-6 h-6 flex items-center justify-center">
						{staticIcon ? (
							<staticIcon.icon width={24} height={24} />
						) : (
							<span className="block w-6 h-6 rounded-sm bg-white/20" />
						)}
					</span>
				)}
			</Link>
		</li>
	);
}
