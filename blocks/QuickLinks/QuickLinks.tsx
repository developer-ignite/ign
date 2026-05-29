import { __ } from "@wordpress/i18n";
import { useBlockProps, useInnerBlocksProps } from "@wordpress/block-editor";
import { cn, shouldDisplay, renameBlock } from "@taktdev/utilities";
import { Appender } from "@taktdev/components";
import { ThemeHeading } from "parts/ThemeHeading";

type QuickLinksAttributes = {
	anchor?: string;
	eyebrow?: string;
	heading?: string;
	description?: string;
	buttons?: Array<{
		title?: string;
		url?: string;
		postId?: number;
		opensInNewTab?: boolean;
		label?: string;
	}>;
};

type EditProps = {
	attributes: QuickLinksAttributes;
	setAttributes: (attrs: Partial<QuickLinksAttributes>) => void;
	clientId: string;
};

export default function Edit({ attributes, setAttributes, clientId }: EditProps) {
	const { displayContent, hasInnerBlocks } = shouldDisplay();

	return (
		<section
			{...useBlockProps({
				className: "quick-links py-16 md:py-20 not-discourse"
			})}
		>
			<div className="container grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
				{/* Left column: Content */}
				<ThemeHeading
					eyebrow={attributes.eyebrow}
					heading={attributes.heading}
					headingSize={2}
					description={attributes.description}
					buttons={attributes.buttons}
					eyebrowPlaceholder={__("Quick Links", "takt")}
					headingPlaceholder={__("Add heading here…", "takt")}
					descriptionPlaceholder={__("Add description here…", "takt")}
					onChange={(value: Partial<QuickLinksAttributes>) => {
						renameBlock(value.heading, attributes.heading, clientId);
						setAttributes(value);
					}}
				/>

				{/* Right column: Link cards */}
				<nav
					aria-label={attributes.heading ? attributes.heading : __("Quick links", "takt")}
					className={cn({
						"flex flex-col gap-4 self-start relative": true,
						hidden: !displayContent && !hasInnerBlocks
					})}
				>
					<Appender />

					<ul
						{...useInnerBlocksProps(
							{
								className: "flex flex-col gap-4"
							},
							{
								allowedBlocks: ["takt/quick-link-item"],
								template: [["takt/quick-link-item"]],
								renderAppender: false
							}
						)}
					/>
				</nav>
			</div>
		</section>
	);
}
