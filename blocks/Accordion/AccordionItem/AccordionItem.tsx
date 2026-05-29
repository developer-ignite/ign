import { __ } from "@wordpress/i18n";
import { useBlockProps, useInnerBlocksProps, InspectorControls } from "@wordpress/block-editor";
import { PanelBody, ToggleControl, ColorPalette } from "@wordpress/components";
import { ThemeColors, ColorValue, ColorClass } from "../../../parts/ThemeColors";
import {
	cn,
	isSelected,
	removeInnerBlockSettings,
	addButtonToBlock,
	renameBlock
} from "@taktdev/utilities";
import { AdvancedRichText } from "@taktdev/components";

removeInnerBlockSettings("takt/accordion-item");
addButtonToBlock("takt/accordion-item", __("Accordion Item Settings", "takt"));

type AccordionItemAttributes = {
	anchor?: string;
	title?: string;
	openByDefault: boolean;
	accentColor?: string;
};

type EditProps = {
	attributes: AccordionItemAttributes;
	setAttributes: (attrs: Partial<AccordionItemAttributes>) => void;
	clientId: string;
};

export default function Edit({ attributes, setAttributes, clientId }: EditProps) {
	const open = isSelected();
	const displayOpen = open || attributes.openByDefault;

	return (
		<>
			<InspectorControls>
				<PanelBody initialOpen={true}>
					<ToggleControl
						label={__("Open by default", "takt")}
						checked={attributes.openByDefault}
						onChange={(value) => setAttributes({ openByDefault: value })}
						__nextHasNoMarginBottom
					/>
				</PanelBody>
				<PanelBody title={__("Settings", "takt")}>
					<ColorPalette
						colors={ThemeColors().colorOptions}
						value={attributes.accentColor ? ColorValue(attributes.accentColor) : undefined}
						onChange={(color) => {
							setAttributes({ accentColor: color ? ColorClass(color) : "" });
						}}
						disableCustomColors={true}
						clearable={true}
					/>
				</PanelBody>
			</InspectorControls>

			<details
				{...useBlockProps({
					className: cn({
						"not-discourse": true,
						"accordion-item group border border-charcoal rounded-3xl transition-all": true,
						"open:bg-accent-lighter": true,
						"not-open:hover:bg-accent": true,
						"is-open": displayOpen,
						[attributes.accentColor]: !!attributes.accentColor
					})
				})}
				open={displayOpen}
			>
				<summary
					className="py-4 px-6 md:p-5 list-none flex gap-4 items-center appearance-none [&::-webkit-details-marker]:hidden cursor-pointer"
					onClick={(event) => event.preventDefault()}
				>
					<AdvancedRichText
						className="font-heading text-lg md:text-xl w-full"
						tagName="h3"
						value={attributes.title}
						allowedFormats={[]}
						onChange={(value) => {
							renameBlock(value, attributes.title, clientId);
							setAttributes({ title: value });
						}}
						placeholder={__("Title", "takt")}
					/>
					<div
						className={cn({
							"shrink-0 ml-auto relative w-4 h-4": true,
							"opacity-50": !attributes.title
						})}
					>
						<div className="w-4 border-current border-b-2 absolute top-1/2 left-0 -translate-y-1/2" />
						<div className="w-4 border-current border-b-2 absolute top-1/2 left-0 -translate-y-1/2 transition-transform rotate-90 group-open:rotate-0" />
					</div>
				</summary>

				<div
					{...useInnerBlocksProps(
						{
							className: "px-6 pb-6 md:px-5 md:pb-5 pt-0 discourse"
						},
						{
							allowedBlocks: ["core/paragraph", "core/list", "takt/button", "takt/button-row"],
							template: [["core/paragraph"]]
						}
					)}
				/>
			</details>
		</>
	);
}
