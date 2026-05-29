import { __ } from "@wordpress/i18n";
import { className, fetchMedia, buildSrcSet, imagePosition } from "@taktdev/utilities";
import { ImageDropUploader, MediaUploadPanel } from "@taktdev/components";
import { useBlockProps, InspectorControls, BlockControls } from "@wordpress/block-editor";
import {
	PanelBody,
	ToggleControl,
	ToolbarGroup,
	ToolbarButton,
	TextControl
} from "@wordpress/components";
import { resizeCornerNE } from "@wordpress/icons";

type ImageAttribute = {
	id: number | null;
	focalPoint?: { x: number; y: number };
};

export default function Edit({ attributes, setAttributes, context }) {
	const { image, isTall, alt } = attributes;

	// Context from parent block
	const masonryStyle = context["masonryCards/masonryStyle"] ?? false;
	const columnCount = context["masonryCards/columnCount"] ?? 2;

	const handleImageSelect = (newImage: ImageAttribute) => {
		setAttributes({ image: newImage });
	};

	const imageFile = fetchMedia(image?.id);

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
				<PanelBody title={__("Image", "takt")}>
					<MediaUploadPanel
						media={image}
						label={__("Image", "takt")}
						onSelect={handleImageSelect}
					/>
					<TextControl
						label={__("Alt Text", "takt")}
						help={__(
							"Describe the image for screen readers. Leave empty if the image is purely decorative.",
							"takt"
						)}
						value={alt}
						onChange={(value) => setAttributes({ alt: value })}
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
				</PanelBody>

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

			<div
				{...useBlockProps({
					className: className({
						"not-discourse": true,
						"rounded-3xl overflow-hidden min-h-[298px] h-full relative after:!outline-none after:!shadow-none after:!border-none after:!hidden": true,
						"sm:min-h-[596px]": masonryStyle && isTall,
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
						"sm:row-span-2": !masonryStyle && isTall
					}),
					role: "listitem"
				})}
			>
				{imageFile?.source_url ? (
					<img
						src={imageFile.source_url}
						alt={alt || imageFile.alt_text || ""}
						srcSet={buildSrcSet(imageFile.media_details?.sizes)}
						className="w-full h-full object-cover absolute inset-0"
						style={{
							objectPosition: image?.focalPoint ? imagePosition(image.focalPoint) : "50% 50%"
						}}
					/>
				) : (
					<ImageDropUploader
						image={image}
						onSelect={handleImageSelect}
						className="w-full! h-full! absolute! inset-0!"
						imageClassName="w-full! h-full! object-cover absolute!"
						placeholderClassName="w-full h-full absolute inset-0"
					/>
				)}
			</div>
		</>
	);
}
