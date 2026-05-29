import { __ } from "@wordpress/i18n";
import { useSelect, useDispatch } from "@wordpress/data";
import { useState, useEffect, createContext } from "@wordpress/element";
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	store as blockEditorStore
} from "@wordpress/block-editor";
import {
	PanelBody,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption
} from "@wordpress/components";
import { cn, shouldDisplay, renameBlock } from "@taktdev/utilities";
import { Appender, AdvancedRichText } from "@taktdev/components";
import { ThemeHeading } from "parts/ThemeHeading";

export const TabsCurrent = createContext<number | null>(null);

type TabsAttributes = {
	anchor?: string;
	eyebrow?: string;
	heading?: string;
	headingSize?: "small" | "regular" | "big";
	description?: string;
	buttons?: Array<{
		title?: string;
		url?: string;
		postId?: number;
		opensInNewTab?: boolean;
		label?: string;
	}>;
	tabsHeading: string[];
	tabsDescription: string[];
	tabsColor: string[];
};

type EditProps = {
	attributes: TabsAttributes;
	setAttributes: (attrs: Partial<TabsAttributes>) => void;
	clientId: string;
};

export default function Edit({ attributes, setAttributes, clientId }: EditProps) {
	const { displayContent, hasInnerBlocks } = shouldDisplay();
	const [innerBlocksLength, setInnerBlocksLength] = useState<number | null>(null);
	const [currentTab, setCurrentTab] = useState(0);

	const { updateBlockAttributes } = useDispatch(blockEditorStore);

	const innerBlocks = useSelect(
		(select) => select(blockEditorStore).getBlocks(clientId),
		[clientId]
	);

	const innerBlockTitles = innerBlocks.map((b: any) => b.attributes?.tabTitle || "");
	const innerBlockDescriptions = innerBlocks.map((b: any) => b.attributes?.tabDescription || "");
	const innerBlockColors = innerBlocks.map((b: any) => b.attributes?.tabColor || "");

	// Sync tabsHeading, tabsDescription, and tabsColor with child attributes
	useEffect(() => {
		if (JSON.stringify(innerBlockTitles) !== JSON.stringify(attributes.tabsHeading)) {
			setAttributes({ tabsHeading: innerBlockTitles });
		}
		if (JSON.stringify(innerBlockDescriptions) !== JSON.stringify(attributes.tabsDescription)) {
			setAttributes({ tabsDescription: innerBlockDescriptions });
		}
		if (JSON.stringify(innerBlockColors) !== JSON.stringify(attributes.tabsColor)) {
			setAttributes({ tabsColor: innerBlockColors });
		}

		// Auto-select newly added tab
		if (innerBlockTitles?.length !== innerBlocksLength) {
			if (innerBlocksLength !== null) {
				setCurrentTab(innerBlockTitles.length - 1);
			}
			setInnerBlocksLength(innerBlockTitles.length);
		}
	}, [innerBlockTitles, innerBlockDescriptions, innerBlockColors]);

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: "tabs-panels flex-1 flex flex-col gap-4 md:gap-0 md:items-stretch"
		},
		{
			allowedBlocks: ["takt/tabs-item"],
			template: [["takt/tabs-item"]],
			renderAppender: false
		}
	);

	const headingSizeMap = { small: 3, regular: 2, big: 1 } as const;
	const numericHeadingSize = headingSizeMap[attributes.headingSize || "regular"];

	return (
		<section
			{...useBlockProps({
				className: "tabs py-6 sm:py-16 not-discourse"
			})}
		>
			<InspectorControls>
				<PanelBody title={__("Settings", "takt")}>
					<ToggleGroupControl
						label={__("Heading Size", "takt")}
						value={attributes.headingSize}
						onChange={(value) =>
							setAttributes({
								headingSize: value as "small" | "regular" | "big"
							})
						}
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					>
						<ToggleGroupControlOption value="small" label={__("Small", "takt")} />
						<ToggleGroupControlOption value="regular" label={__("Regular", "takt")} />
						<ToggleGroupControlOption value="big" label={__("Big", "takt")} />
					</ToggleGroupControl>
				</PanelBody>
			</InspectorControls>

			<div className="container grid grid-cols-1 gap-y-16">
				{/* ThemeHeading */}
				<ThemeHeading
					eyebrow={attributes.eyebrow}
					heading={attributes.heading}
					headingSize={numericHeadingSize}
					description={attributes.description}
					buttons={attributes.buttons}
					columns={2}
					onChange={(value: Partial<TabsAttributes>) => {
						renameBlock(value.heading, attributes.heading, clientId);
						setAttributes(value);
					}}
				/>

				{/* Tabs layout: tablist buttons + content panels */}
				{(displayContent || hasInnerBlocks) && (
					<div className="tabs-layout flex flex-col md:flex-row items-stretch">
						{/* Desktop tablist - hidden on mobile */}
						<div
							className="tabs-tablist hidden md:flex flex-col gap-4 py-16 flex-1 md:sticky md:top-[calc(var(--fixed-elements-height)+32px)] md:self-start"
							role="tablist"
							aria-label={attributes.heading || "Tabs"}
							aria-orientation="vertical"
						>
							{attributes.tabsHeading.map((title, index) => {
								const childClientId = innerBlocks[index]?.clientId;
								const isActive = currentTab === index;
								const tabColor = attributes.tabsColor[index] || "";

								return (
									<button
										key={index}
										type="button"
										className={cn({
											"tabs-button border-l border-t border-b border-charcoal rounded-l-3xl p-6 flex flex-col items-start justify-center w-full text-left transition-all cursor-pointer min-h-[140px] hover:bg-accent-light": true,
											"bg-accent selected hover:!bg-accent": isActive,
											[tabColor]: tabColor !== ""
										})}
										onClick={() => setCurrentTab(index)}
									>
										{isActive && childClientId ? (
											<AdvancedRichText
												className="tabs-button-title font-heading text-header-3 md:text-[2.5rem] leading-none w-full"
												tagName="span"
												value={title}
												allowedFormats={[]}
												onChange={(value: string) => {
													updateBlockAttributes(childClientId, {
														tabTitle: value
													});
												}}
												placeholder={__("Tab Title", "takt")}
											/>
										) : (
											<span className="tabs-button-title font-heading text-header-3 md:text-[2.5rem] leading-none w-full">
												{title || __("Tab Title", "takt")}
											</span>
										)}
										{isActive && childClientId ? (
											<AdvancedRichText
												className="tabs-button-description text-base font-medium w-full mt-6"
												tagName="span"
												value={attributes.tabsDescription[index] || ""}
												allowedFormats={[]}
												onChange={(value: string) => {
													updateBlockAttributes(childClientId, {
														tabDescription: value
													});
												}}
												placeholder={__("Description", "takt")}
											/>
										) : (
											attributes.tabsDescription[index] && (
												<span className="tabs-button-description text-base font-medium w-full mt-6">
													{attributes.tabsDescription[index]}
												</span>
											)
										)}
									</button>
								);
							})}
						</div>

						{/* Tab panels - contains the <details> elements */}
						<TabsCurrent.Provider value={currentTab}>
							<div className="relative flex-1 flex flex-col">
								<Appender />
								<div {...innerBlocksProps} />
							</div>
						</TabsCurrent.Provider>
					</div>
				)}
			</div>
		</section>
	);
}
