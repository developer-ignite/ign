import { __ } from "@wordpress/i18n";
import {
	useBlockProps,
	useInnerBlocksProps,
	RichText,
	InspectorControls
} from "@wordpress/block-editor";
import { PanelBody, ToggleControl } from "@wordpress/components";
import { cn, shouldDisplay, renameBlock, addButtonToBlock } from "@taktdev/utilities";

import { Appender } from "@taktdev/components";

addButtonToBlock("takt/wide-social-media", __("Social Media Settings", "takt"));

type WideSocialMediaAttributes = {
	anchor?: string;
	heading?: string;
	showLabel?: boolean;
};

type EditProps = {
	attributes: WideSocialMediaAttributes;
	setAttributes: (attrs: Partial<WideSocialMediaAttributes>) => void;
	clientId: string;
};

export default function Edit({ attributes, setAttributes, clientId }: EditProps) {
	const { displayContent, hasInnerBlocks } = shouldDisplay();

	return (
		<>
			<InspectorControls>
				<PanelBody title={__("Display", "takt")}>
					<ToggleControl
						label={__("Show social media names", "takt")}
						help={__("When disabled, only icons are shown. Names appear on hover.", "takt")}
						checked={attributes.showLabel !== false}
						onChange={(showLabel) => setAttributes({ showLabel })}
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>

			<aside
				{...useBlockProps({
					className: "wide-social-media not-discourse"
				})}
			>
				<div className="container max-w-[var(--discourse-narrow,55rem)] mt-8 mb-8 border-t border-charcoal pt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					{/* Heading */}
					{(displayContent || attributes.heading) && (
						<RichText
							tagName="h2"
							className="text-header-5"
							value={attributes.heading}
							onChange={(heading) => {
								renameBlock(heading, attributes.heading, clientId);
								setAttributes({ heading });
							}}
							placeholder={__("Follow Us", "takt")}
						/>
					)}

					{/* Social links */}
					<nav
						aria-label={__("Social Media Links", "takt")}
						className={cn({
							"relative md:ml-auto": true,
							hidden: !displayContent && !hasInnerBlocks
						})}
					>
						<Appender />

						<ul
							{...useInnerBlocksProps(
								{
									className:
										"flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:justify-end md:gap-x-4 md:gap-y-0"
								},
								{
									allowedBlocks: ["takt/wide-social-media-item"],
									template: [["takt/wide-social-media-item"]],
									renderAppender: false
								}
							)}
						/>
					</nav>
				</div>
			</aside>
		</>
	);
}
