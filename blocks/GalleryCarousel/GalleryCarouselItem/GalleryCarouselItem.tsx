import { __ } from "@wordpress/i18n";
import { useBlockProps, InspectorControls } from "@wordpress/block-editor";
import { PanelBody } from "@wordpress/components";
import { shouldDisplay, fetchMedia } from "@taktdev/utilities";
import { ImageDropUploader, MediaUploadPanel } from "@taktdev/components";

type ImageAttribute = {
	id: number | null;
	focalPoint?: { x: number; y: number };
};

type GalleryCarouselItemAttributes = {
	anchor?: string;
	image: ImageAttribute;
};

type EditProps = {
	attributes: GalleryCarouselItemAttributes;
	setAttributes: (attrs: Partial<GalleryCarouselItemAttributes>) => void;
	clientId: string;
};

export default function Edit({ attributes, setAttributes }: EditProps) {
	const { displayContent } = shouldDisplay();
	const mediaImage = fetchMedia(attributes.image?.id || null);

	return (
		<>
			<InspectorControls>
				<PanelBody title={__("Image", "takt")} initialOpen={true}>
					<MediaUploadPanel
						media={attributes.image}
						label={__("Gallery Image", "takt")}
						onSelect={(image: ImageAttribute) => setAttributes({ image })}
					/>
				</PanelBody>
			</InspectorControls>

			<div
				{...useBlockProps({
					className: "swiper-slide not-discourse"
				})}
			>
				<div className="w-full">
					{!mediaImage?.source_url ? (
						displayContent && (
							<ImageDropUploader
								image={attributes.image}
								onSelect={(image: ImageAttribute) => setAttributes({ image })}
								className="w-full! h-auto! object-cover aspect-[1.08] sm:aspect-[2.45]"
								imageClassName="w-full! h-auto! object-cover aspect-[1.08] sm:aspect-[2.45]"
								placeholderClassName="w-full aspect-[1.08] sm:aspect-[2.45]"
							/>
						)
					) : (
						<img
							src={mediaImage?.source_url}
							alt={mediaImage?.alt_text || ""}
							className="w-full! h-auto! object-cover aspect-[1.08] sm:aspect-[2.45]"
						/>
					)}
				</div>
			</div>
		</>
	);
}
