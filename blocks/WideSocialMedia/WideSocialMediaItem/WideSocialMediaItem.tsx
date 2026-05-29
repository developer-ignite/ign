import { __ } from "@wordpress/i18n";
import { useState, useRef } from "@wordpress/element";
import {
	useBlockProps,
	BlockControls,
	RichText,
	// @ts-ignore
	__experimentalLinkControl as LinkControl
} from "@wordpress/block-editor";
import { ToolbarGroup, ToolbarButton, Popover } from "@wordpress/components";
import { link as linkIcon } from "@wordpress/icons";
import { renameBlock, cn } from "@taktdev/utilities";
import { IconPicker, SuggestedIcon } from "@taktdev/components";

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

type LinkObject = {
	title?: string;
	url?: string;
	opensInNewTab?: boolean;
	label?: string;
};

type WideSocialMediaItemAttributes = {
	anchor?: string;
	link?: LinkObject;
	logoId?: number | null;
	iconSlug?: string;
	label?: string;
};

type EditProps = {
	attributes: WideSocialMediaItemAttributes;
	setAttributes: (attrs: Partial<WideSocialMediaItemAttributes>) => void;
	clientId: string;
	context: {
		"takt/wide-social-media/showLabel"?: boolean;
	};
};

export default function Edit({ attributes, setAttributes, clientId, context }: EditProps) {
	const [isLinkOpen, setIsLinkOpen] = useState(false);
	const linkRef = useRef<HTMLAnchorElement>(null);

	const showLabel = context["takt/wide-social-media/showLabel"] !== false;
	const hasIcon = !!(attributes.iconSlug || attributes.logoId);

	let iconPickerValue: { slug: string } | { mediaId: number } | null = null;
	if (attributes.iconSlug) {
		iconPickerValue = { slug: attributes.iconSlug };
	} else if (attributes.logoId) {
		iconPickerValue = { mediaId: attributes.logoId };
	}

	const handleLinkChange = (newLink: Partial<LinkObject>) => {
		const updatedLink = {
			...(attributes.link || {}),
			...newLink
		};

		renameBlock(updatedLink.title, attributes.link?.title, clientId);
		setAttributes({ link: updatedLink });
	};

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon={linkIcon}
						label={__("Edit Link", "takt")}
						onClick={() => setIsLinkOpen(!isLinkOpen)}
						isPressed={isLinkOpen}
					/>
				</ToolbarGroup>
			</BlockControls>

			<li
				{...useBlockProps({
					className: "block list-none not-discourse"
				})}
			>
				<a
					ref={linkRef}
					href={attributes.link?.url || "#"}
					className="flex items-center gap-3 py-2 no-underline! hover:underline! transition-colors"
					onClick={(e) => e.preventDefault()}
					title={!showLabel ? attributes.label || attributes.link?.title || "" : undefined}
				>
					{/* Icon */}
					<span
						className={cn({
							"w-6 h-6 shrink-0": true,
							"*:w-6 *:h-6 *:object-contain *:object-center": hasIcon
						})}
					>
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
					</span>

					{/* Label - always shown in editor, with reduced opacity when hidden */}
					<RichText
						tagName="span"
						className={cn({
							"text-xs font-medium leading-normal": true,
							"opacity-50": !showLabel
						})}
						value={attributes.label}
						onChange={(label) => setAttributes({ label })}
						placeholder={__("Label", "takt")}
						allowedFormats={[]}
					/>
				</a>

				{/* Link Control Popover */}
				{isLinkOpen && (
					<Popover placement="bottom" onClose={() => setIsLinkOpen(false)} anchor={linkRef.current}>
						<div style={{ padding: "16px", minWidth: "300px" }}>
							<LinkControl
								value={{
									url: attributes.link?.url || "",
									title: attributes.link?.title || "",
									opensInNewTab:
										attributes.link?.opensInNewTab !== undefined
											? attributes.link.opensInNewTab
											: true
								}}
								onChange={(newValue: any) => {
									handleLinkChange({
										url: newValue.url,
										title: newValue.title || "",
										opensInNewTab: newValue.opensInNewTab
									});
								}}
								settings={[
									{
										id: "opensInNewTab",
										title: __("Open in new tab", "takt")
									}
								]}
							/>
						</div>
					</Popover>
				)}
			</li>
		</>
	);
}
