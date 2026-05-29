import { __ } from "@wordpress/i18n";
import { className, shouldDisplay } from "@taktdev/utilities";
import { useBlockProps, InspectorControls, RichText, BlockControls } from "@wordpress/block-editor";
import {
	PanelBody,
	ToggleControl,
	ToolbarGroup,
	ToolbarButton,
	ColorPalette
} from "@wordpress/components";
import { resizeCornerNE } from "@wordpress/icons";
import { ThemeColors, ColorValue, ColorClass } from "../../../parts/ThemeColors";

export default function Edit({ attributes, setAttributes, context }) {
	const { displayContent } = shouldDisplay();
	const { title, content, isTall } = attributes;

	// Context from parent block
	const masonryStyle = context["masonryCards/masonryStyle"] ?? false;
	const columnCount = context["masonryCards/columnCount"] ?? 2;

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon={resizeCornerNE}
						label={__("Tall Card", "takt")}
						isPressed={isTall}
						onClick={() => setAttributes({ isTall: !isTall })}
					/>
				</ToolbarGroup>
			</BlockControls>

			<InspectorControls>
				<PanelBody title={__("Card Settings", "takt")}>
					<ToggleControl
						label={__("Tall Card", "takt")}
						help={
							masonryStyle
								? __("Make this card span three rows", "takt")
								: __("Make this card span two rows", "takt")
						}
						checked={isTall}
						onChange={(value) => setAttributes({ isTall: value })}
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>

			<InspectorControls>
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

			<div
				{...useBlockProps({
					className: className({
						"not-discourse": true,
						"relative rounded-3xl p-6 flex flex-col justify-between min-h-[298px] h-full before:absolute before:inset-0 before:bg-accent before:rounded-3xl before:-z-1 after:!outline-none after:!shadow-none after:!border-none after:!hidden": true,
						"sm:min-h-[596px]": masonryStyle && isTall,
						// Tall cards: split background into top/bottom halves on desktop
						"md:before:inset-x-0 md:before:top-0 md:before:h-1/2 md:after:!block md:after:!absolute md:after:!inset-x-0 md:after:!top-auto md:after:!bottom-0 md:after:!h-1/2 md:after:bg-accent md:after:rounded-3xl md:after:!-z-1":
							isTall,
						// sm: 2 columns - pattern 2,1,1,2
						"nth-[4n+1]:sm:col-start-1 nth-[4n+2]:sm:col-start-2 nth-[4n+3]:sm:col-start-1 nth-[4n+4]:sm:col-start-2":
							masonryStyle,
						"nth-[4n+1]:sm:row-span-2 nth-[4n+2]:sm:row-span-1 nth-[4n+3]:sm:row-span-1 nth-[4n+4]:sm:row-span-2":
							masonryStyle && !isTall,
						// md: 3 columns - pattern 1,2,1,2,1,2
						"nth-[6n+1]:md:col-start-1 nth-[6n+2]:md:col-start-2 nth-[6n+3]:md:col-start-3 nth-[6n+4]:md:col-start-1 nth-[6n+5]:md:col-start-2 nth-[6n+6]:md:col-start-3":
							masonryStyle && columnCount === 3,
						"nth-[6n+1]:md:row-span-1 nth-[6n+2]:md:row-span-2 nth-[6n+3]:md:row-span-1 nth-[6n+4]:md:row-span-2 nth-[6n+5]:md:row-span-1 nth-[6n+6]:md:row-span-2":
							masonryStyle && !isTall && columnCount === 3,
						// md: 4 columns - pattern 2,1,2,1,1,2,1,2
						"nth-[8n+1]:md:col-start-1 nth-[8n+2]:md:col-start-2 nth-[8n+3]:md:col-start-3 nth-[8n+4]:md:col-start-4 nth-[8n+5]:md:col-start-1 nth-[8n+6]:md:col-start-2 nth-[8n+7]:md:col-start-3 nth-[8n+8]:md:col-start-4":
							masonryStyle && columnCount === 4,
						"nth-[8n+1]:md:row-span-2 nth-[8n+2]:md:row-span-1 nth-[8n+3]:md:row-span-2 nth-[8n+4]:md:row-span-1 nth-[8n+5]:md:row-span-1 nth-[8n+6]:md:row-span-2 nth-[8n+7]:md:row-span-1 nth-[8n+8]:md:row-span-2":
							masonryStyle && !isTall && columnCount === 4,
						// Tall cards in masonry mode - 3 rows
						"sm:!row-span-3": masonryStyle && isTall,
						"md:!row-span-3": masonryStyle && isTall && columnCount >= 3,
						// Tall cards in non-masonry mode - 2 rows
						"sm:row-span-2": !masonryStyle && isTall,
						[attributes.accentColor]: !!attributes.accentColor
					}),
					role: "listitem"
				})}
			>
				<RichText
					tagName="h3"
					value={title}
					onChange={(value) => setAttributes({ title: value })}
					placeholder={__("Enter title…", "takt")}
					className={className({
						"masonry-card-title mb-4 break-words relative z-1": true,
						"text-header-1": !title || title.length <= 10,
						"text-header-3": title && title.length > 10,
						"md:pb-8": masonryStyle && isTall
					})}
					allowedFormats={[]}
				/>

				{(displayContent || content) && (
					<RichText
						tagName="p"
						value={content}
						onChange={(value) => setAttributes({ content: value })}
						placeholder={__("Enter content…", "takt")}
						className={className({
							"text-base relative z-1": true,
							"md:pt-8": masonryStyle && isTall
						})}
						allowedFormats={[]}
					/>
				)}
			</div>
		</>
	);
}
