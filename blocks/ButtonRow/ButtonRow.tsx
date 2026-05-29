import { __ } from "@wordpress/i18n";
import { cn, autoAddBlock, addButtonToBlock } from "@taktdev/utilities";

import { useBlockProps, useInnerBlocksProps, InspectorControls } from "@wordpress/block-editor";
import {
	PanelBody,
	__experimentalVStack as VStack,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption
} from "@wordpress/components";
import { Appender } from "@taktdev/components";

addButtonToBlock("takt/button-row", __("Button Row Settings", "takt"));

export default function Edit({ attributes, setAttributes }) {
	const blockProps = useBlockProps({
		className: "button-row block not-discourse"
	});

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: cn({
				"flex flex-wrap gap-x-4 gap-y-2 items-center": true,
				"justify-start": attributes.style?.typography?.textAlign === "left",
				"justify-center": attributes.style?.typography?.textAlign === "center",
				"justify-end": attributes.style?.typography?.textAlign === "right"
			})
		},
		{
			allowedBlocks: ["takt/button"],
			template: [["takt/button"]],
			orientation: "horizontal",
			renderAppender: false
		}
	);

	autoAddBlock("takt/button");

	const Tag = attributes.tagName || "p";

	return (
		<>
			<InspectorControls>
				<PanelBody initialOpen={true}>
					<VStack>
						<ToggleGroupControl
							label={__("HTML Element", "takt")}
							value={attributes.tagName}
							onChange={(value) => setAttributes({ tagName: value })}
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						>
							<ToggleGroupControlOption value="div" label={__("div", "takt")} />
							<ToggleGroupControlOption value="span" label={__("span", "takt")} />
							<ToggleGroupControlOption value="p" label={__("p", "takt")} />
							<ToggleGroupControlOption value="li" label={__("li", "takt")} />
						</ToggleGroupControl>
					</VStack>
				</PanelBody>
			</InspectorControls>

			<Tag {...blockProps}>
				<Appender />
				<span {...innerBlocksProps} />
			</Tag>
		</>
	);
}
