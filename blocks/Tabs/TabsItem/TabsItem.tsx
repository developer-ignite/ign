import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import { useContext } from "@wordpress/element";
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	store as blockEditorStore
} from "@wordpress/block-editor";
import { PanelBody, ColorPalette } from "@wordpress/components";
import {
	cn,
	isSelected as isBlockSelected,
	removeInnerBlockSettings,
	addButtonToBlock,
	renameBlock
} from "@taktdev/utilities";
import { AdvancedRichText } from "@taktdev/components";
import { TabsCurrent } from "../Tabs";
import { ThemeColors, ColorValue, ColorClass } from "../../../parts/ThemeColors";

removeInnerBlockSettings("takt/tabs-item");
addButtonToBlock("takt/tabs-item", __("Tab Settings", "takt"));

type TabsItemAttributes = {
	anchor?: string;
	tabTitle?: string;
	tabDescription?: string;
	tabColor?: string;
};

type EditProps = {
	attributes: TabsItemAttributes;
	setAttributes: (attrs: Partial<TabsItemAttributes>) => void;
	clientId: string;
};

export default function Edit({ attributes, setAttributes, clientId }: EditProps) {
	const currentTab = useContext(TabsCurrent);
	const selected = isBlockSelected();

	// Get this block's index among siblings
	const blockIndex = useSelect(
		(select) => {
			const { getBlockRootClientId, getBlockOrder } = select(blockEditorStore);
			const parentClientId = getBlockRootClientId(clientId);
			const order = getBlockOrder(parentClientId);
			return order.indexOf(clientId);
		},
		[clientId]
	);

	const isActiveTab = currentTab === blockIndex;
	const displayOpen = isActiveTab || selected;

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: "discourse"
		},
		{
			allowedBlocks: [
				"core/heading",
				"core/paragraph",
				"core/list",
				"core/quote",
				"core/table",
				"core/image",
				"core/video",
				"core/separator",
				"takt/button-row",
				"takt/link-with-details"
			]
		}
	);

	const tabColor = attributes.tabColor || "";

	return (
		<>
			<InspectorControls>
				<PanelBody title={__("Tab Settings", "takt")}>
					<ColorPalette
						colors={ThemeColors().colorOptions}
						value={tabColor ? ColorValue(tabColor) : undefined}
						onChange={(color) => {
							setAttributes({ tabColor: color ? ColorClass(color) : "" });
						}}
						disableCustomColors={true}
						clearable={true}
					/>
				</PanelBody>
			</InspectorControls>
			<div
				{...useBlockProps({
					className: cn({
						"not-discourse": true,
						"tabs-item-wrapper md:flex-1 md:rounded-3xl transition-colors": true,
						"md:hidden": !displayOpen,
						"bg-accent-lighter": displayOpen,
						[tabColor]: tabColor !== "" && displayOpen
					})
				})}
			>
				<details
					className={cn({
						"tabs-item group transition-all overflow-hidden border border-charcoal rounded-3xl": true,
						"open:bg-accent-lighter open:border open:border-charcoal": true,
						"md:hidden md:open:block md:border-0 md:rounded-3xl md:bg-transparent": true,
						"md:overflow-visible md:self-start md:open:p-6": true,
						[tabColor]: tabColor !== ""
					})}
					open={displayOpen}
				>
					{/* Summary - visible on mobile and desktop */}
					<summary
						className="tabs-item-summary p-6 list-none flex gap-4 items-start appearance-none [&::-webkit-details-marker]:hidden cursor-pointer hover:bg-accent-light group-open:hover:bg-transparent transition-colors md:mb-8 md:p-0 md:cursor-default md:hover:bg-transparent md:group-open:hover:bg-transparent"
						onClick={(event) => event.preventDefault()}
					>
						<AdvancedRichText
							className="font-heading text-header-3 md:text-[2.5rem] w-full"
							tagName="h3"
							value={attributes.tabTitle}
							allowedFormats={[]}
							onChange={(value: string) => {
								renameBlock(value, attributes.tabTitle, clientId);
								setAttributes({ tabTitle: value });
							}}
							placeholder={__("Tab Title", "takt")}
						/>
						<div
							className={cn({
								"shrink-0 ml-auto relative w-5 h-5 mt-[9px] md:hidden": true,
								"opacity-50": !attributes.tabTitle
							})}
						>
							<div className="w-5 border-current border-b-2 absolute top-1/2 left-0 -translate-y-1/2" />
							<div className="w-5 border-current border-b-2 absolute top-1/2 left-0 -translate-y-1/2 transition-transform rotate-90 group-open:rotate-0" />
						</div>
					</summary>

					<div className="tabs-item-inner">
						<div className="tabs-item-content px-6 pb-6 pt-2 md:p-0">
							<div {...innerBlocksProps} />
						</div>
					</div>
				</details>
			</div>
		</>
	);
}
