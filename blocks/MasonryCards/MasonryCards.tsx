import { __ } from "@wordpress/i18n";
import { className, shouldDisplay, renameBlock, addButtonToBlock } from "@taktdev/utilities";

import { Appender } from "@taktdev/components";
import { useBlockProps, useInnerBlocksProps, InspectorControls } from "@wordpress/block-editor";
import {
	PanelBody,
	ToggleControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption
} from "@wordpress/components";
import { ThemeHeading } from "parts/ThemeHeading";

addButtonToBlock("takt/masonry-cards", __("Masonry Cards Settings", "takt"));

export default function Edit({ attributes, setAttributes, clientId }) {
	const { displayContent, hasInnerBlocks } = shouldDisplay();
	const { columnCount, masonryStyle } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody title={__("Layout Settings", "takt")}>
					<ToggleGroupControl
						label={__("Column Count", "takt")}
						value={String(columnCount)}
						onChange={(value) =>
							setAttributes({
								columnCount: parseInt(value as string, 10)
							})
						}
						isBlock
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					>
						<ToggleGroupControlOption value="2" label="2" />
						<ToggleGroupControlOption value="3" label="3" />
						<ToggleGroupControlOption value="4" label="4" />
					</ToggleGroupControl>

					<ToggleControl
						label={__("Masonry Style", "takt")}
						help={__("Creates a staggered layout where cards can align to different rows", "takt")}
						checked={masonryStyle}
						onChange={(value) => setAttributes({ masonryStyle: value })}
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>

			<section
				{...useBlockProps({
					className: "py-6 sm:py-16 not-discourse"
				})}
			>
				<div className="container">
					<ThemeHeading
						eyebrow={attributes.eyebrow}
						heading={attributes.heading}
						headingSize={2}
						description={attributes.description}
						buttons={attributes.buttons}
						columns={2}
						onChange={(value) => {
							renameBlock(value.heading, attributes.heading, clientId);
							setAttributes(value);
						}}
					/>

					<div
						className={className({
							relative: true,
							hidden: !displayContent && !hasInnerBlocks
						})}
					>
						<Appender />

						<div
							{...useInnerBlocksProps(
								{
									className: className({
										"grid gap-6 mt-16 grid-cols-1 sm:grid-cols-2": true,
										"md:grid-cols-3": columnCount === 3,
										"md:grid-cols-4": columnCount === 4,
										// Masonry grid settings
										"sm:grid-flow-dense sm:auto-rows-[minmax(0,1fr)_48px_minmax(0,1fr)]":
											masonryStyle,
										// Non-masonry: enable row spanning for tall cards
										"sm:grid-flow-dense sm:auto-rows-[minmax(0,1fr)]": !masonryStyle
									}),
									role: "list"
								},
								{
									allowedBlocks: ["takt/text-card", "takt/image-card"],
									template: [["takt/text-card"], ["takt/image-card"]],
									renderAppender: false
								}
							)}
						/>
					</div>
				</div>
			</section>
		</>
	);
}
