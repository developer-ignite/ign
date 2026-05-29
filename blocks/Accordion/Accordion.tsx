import { __ } from "@wordpress/i18n";
import { useRef, useState, useEffect } from "@wordpress/element";
import {
	cn,
	shouldDisplay,
	renameBlock,
	fetchMedia,
	extractVideoId,
	addButtonToBlock
} from "@taktdev/utilities";

import { Appender, ImageDropUploader, MediaUploadPanel } from "@taktdev/components";
import { useBlockProps, useInnerBlocksProps, InspectorControls } from "@wordpress/block-editor";
import {
	PanelBody,
	BaseControl,
	ToggleControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	__experimentalInputControl as InputControl
} from "@wordpress/components";

import { ThemeHeading } from "parts/ThemeHeading";
import { ReactComponent as IconPlay } from "./resources/IconPlay.svg";

addButtonToBlock("takt/accordion", __("Accordion Settings", "takt"));

type FocalPoint = {
	x: number;
	y: number;
};

type ImageAttribute = {
	id: number | null;
	focalPoint?: FocalPoint;
};

type AccordionAttributes = {
	anchor?: string;
	blockVariation: "default" | "with-media";
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
	mediaType: "image" | "video";
	mediaId?: number;
	focalPoint: FocalPoint;
	videoSource: "file" | "youtube" | "vimeo";
	videoFile?: number;
	videoId?: string;
	posterImage: ImageAttribute;
	exclusiveMode: boolean;
	alwaysOneOpen: boolean;
	enableFaqSchema: boolean;
};

type EditProps = {
	attributes: AccordionAttributes;
	setAttributes: (attrs: Partial<AccordionAttributes>) => void;
	clientId: string;
};

export default function Edit({ attributes, setAttributes, clientId }: EditProps) {
	const { displayContent, hasInnerBlocks } = shouldDisplay();
	const isWithMedia = attributes.blockVariation === "with-media";

	// Fetch media (only used for with-media variation)
	const videoFile = fetchMedia(attributes.videoFile || null);

	// Video playback state
	const [mediaRenderId, setMediaRenderId] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const videoRef = useRef<HTMLDivElement>(null);

	// Reset playback state when media changes
	useEffect(() => {
		setMediaRenderId(mediaRenderId + 1);
		setIsPlaying(false);
	}, [
		attributes.mediaType,
		attributes.videoId,
		attributes.videoSource,
		attributes.posterImage?.id
	]);

	// Check if we have video
	const hasVideo =
		(attributes.videoSource === "file" && videoFile?.source_url) ||
		(["youtube", "vimeo"].includes(attributes.videoSource) && !!attributes.videoId);

	const playVideo = () => {
		if (!videoRef.current) {
			return;
		}

		const videoContainer = videoRef.current;

		if (attributes.videoSource === "file" && videoContainer.querySelector("video")) {
			const video = videoContainer.querySelector("video");
			if (video) {
				video.play();
				setIsPlaying(true);
			}
		} else if (attributes.videoSource === "youtube") {
			const wrapper = videoContainer.querySelector(".embed-video-container");
			if (wrapper) {
				wrapper.innerHTML = `<iframe src="https://www.youtube.com/embed/${attributes.videoId}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" loading="lazy"></iframe>`;
				setIsPlaying(true);
			}
		} else if (attributes.videoSource === "vimeo") {
			const wrapper = videoContainer.querySelector(".embed-video-container");
			if (wrapper) {
				wrapper.innerHTML = `<iframe src="https://player.vimeo.com/video/${attributes.videoId}?autoplay=1&byline=0&portrait=0&badge=0&dnt=true&vimeo_logo=false&title=false" allow="autoplay; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
				setIsPlaying(true);
			}
		}
	};

	return (
		<>
			{/* Inspector controls */}
			<InspectorControls>
				{/* Behavior panel - shown for all variations */}
				<PanelBody title={__("Behavior", "takt")} initialOpen={true}>
					<ToggleControl
						label={__("Only one open at a time", "takt")}
						checked={attributes.exclusiveMode}
						onChange={(value) => setAttributes({ exclusiveMode: value })}
						__nextHasNoMarginBottom
					/>

					{attributes.exclusiveMode && (
						<ToggleControl
							label={__("Always keep one open", "takt")}
							checked={attributes.alwaysOneOpen}
							onChange={(value) => setAttributes({ alwaysOneOpen: value })}
							__nextHasNoMarginBottom
						/>
					)}

					<ToggleControl
						label={__("Enable FAQ schema (SEO)", "takt")}
						help={__("Outputs FAQPage structured data for search engines", "takt")}
						checked={attributes.enableFaqSchema}
						onChange={(value) => setAttributes({ enableFaqSchema: value })}
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				{/* Media settings - only shown for with-media variation */}
				{isWithMedia && (
					<>
						<PanelBody title={__("Settings", "takt")} initialOpen={true}>
							<ToggleGroupControl
								label={__("Media Type", "takt")}
								value={attributes.mediaType}
								onChange={(value) =>
									setAttributes({
										mediaType: value as "image" | "video"
									})
								}
								__nextHasNoMarginBottom
								__next40pxDefaultSize
							>
								<ToggleGroupControlOption value="image" label={__("Image", "takt")} />
								<ToggleGroupControlOption value="video" label={__("Video", "takt")} />
							</ToggleGroupControl>

							{attributes.mediaType === "video" && (
								<ToggleGroupControl
									label={__("Video Source", "takt")}
									value={attributes.videoSource}
									onChange={(value) =>
										setAttributes({
											videoSource: value as "file" | "youtube" | "vimeo"
										})
									}
									__nextHasNoMarginBottom
									__next40pxDefaultSize
								>
									<ToggleGroupControlOption value="file" label={__("File", "takt")} />
									<ToggleGroupControlOption value="youtube" label={__("YouTube", "takt")} />
									<ToggleGroupControlOption value="vimeo" label={__("Vimeo", "takt")} />
								</ToggleGroupControl>
							)}
						</PanelBody>

						<PanelBody title={__("Media", "takt")} initialOpen={true}>
							{attributes.mediaType === "image" && (
								<MediaUploadPanel
									media={{
										id: attributes.mediaId,
										focalPoint: attributes.focalPoint
									}}
									label={__("Image", "takt")}
									onSelect={(image) =>
										setAttributes({
											mediaId: image.id,
											focalPoint: image.focalPoint || {
												x: 0.5,
												y: 0.5
											}
										})
									}
								/>
							)}

							{attributes.mediaType === "video" && (
								<>
									{attributes.videoSource === "file" && (
										<MediaUploadPanel
											media={attributes.videoFile}
											label={__("Video File", "takt")}
											allowedTypes={["video"]}
											onSelect={(media) =>
												setAttributes({
													videoFile: media.id
												})
											}
											enableFocalPoint={false}
										/>
									)}

									{["vimeo", "youtube"].includes(attributes.videoSource) && (
										<BaseControl
											id="accordion-video-url-control"
											label={__("Video URL or ID", "takt")}
											__nextHasNoMarginBottom
										>
											<InputControl
												__next40pxDefaultSize
												label={__("Video URL or ID", "takt")}
												hideLabelFromVision
												value={attributes.videoId}
												autoComplete="off"
												spellCheck={false}
												type="text"
												placeholder={
													attributes.videoSource === "youtube" ? "dQw4w9WgXcQ" : "123456789"
												}
												onChange={(newValue) => {
													const videoId = extractVideoId(newValue || "");
													setAttributes({
														videoId
													});
												}}
											/>
										</BaseControl>
									)}

									<MediaUploadPanel
										media={attributes.posterImage}
										label={__("Poster Image", "takt")}
										onSelect={(image) =>
											setAttributes({
												posterImage: image
											})
										}
									/>
								</>
							)}
						</PanelBody>
					</>
				)}
			</InspectorControls>

			<section
				{...useBlockProps({
					className: cn({
						"not-discourse": true,
						"accordion py-6 sm:py-16": true,
						"accordion--with-media": isWithMedia
					})
				})}
			>
				<div
					className={cn({
						"container grid grid-cols-1 md:grid-cols-2 gap-x-16": true,
						"gap-y-16": !isWithMedia,
						"gap-y-6 md:gap-y-10": isWithMedia
					})}
				>
					{/* Heading section - uses columns=2 for with-media to split eyebrow+heading | description+buttons */}
					<ThemeHeading
						className={isWithMedia ? "md:col-span-2 md:row-1" : ""}
						eyebrow={attributes.eyebrow}
						heading={attributes.heading}
						headingSize={2}
						description={attributes.description}
						buttons={attributes.buttons}
						columns={isWithMedia ? 2 : 1}
						onChange={(value: Partial<AccordionAttributes>) => {
							renameBlock(value.heading, attributes.heading, clientId);
							setAttributes(value);
						}}
					/>

					{/* Media section - only rendered for with-media variation */}
					{isWithMedia && (
						<div className="md:col-1 md:row-2 order-3 md:order-none self-start md:sticky md:top-[calc(var(--header-main-height,0px)+1rem)]">
							{/* Image */}
							{attributes.mediaType === "image" && (
								<ImageDropUploader
									className="aspect-[4/3] bg-off-white default-mask overflow-hidden"
									image={{
										id: attributes.mediaId,
										focalPoint: attributes.focalPoint
									}}
									onSelect={(image) =>
										setAttributes({
											mediaId: image.id,
											focalPoint: image.focalPoint || {
												x: 0.5,
												y: 0.5
											}
										})
									}
								/>
							)}

							{/* Video */}
							{attributes.mediaType === "video" && (
								<div
									ref={videoRef}
									key={mediaRenderId}
									className="accordion-video-container relative w-full aspect-[4/3] grid grid-cols-1 bg-black overflow-hidden default-mask"
								>
									{/* Poster Image + Play Button (hidden when playing) */}
									{(!!attributes.posterImage?.id || !hasVideo) && (
										<button
											onClick={playVideo}
											type="button"
											className={cn({
												"w-full h-full col-1 row-1 cursor-pointer z-2 accordion-play-button group relative": true,
												hidden: isPlaying
											})}
										>
											<ImageDropUploader
												image={attributes.posterImage}
												onSelect={(image) =>
													setAttributes({
														posterImage: image
													})
												}
												className="absolute! inset-0 w-full! h-full! object-cover pointer-events-none!"
												imageClassName="absolute! inset-0 w-full! h-full! object-cover pointer-events-none!"
												placeholderClassName="absolute inset-0 w-full h-full *:max-h-full *:max-w-full"
											/>
											{hasVideo && (
												<span
													className="absolute inset-0 flex items-center justify-center z-2"
													aria-hidden="true"
												>
													<span className="play-icon">
														<IconPlay />
													</span>
												</span>
											)}
										</button>
									)}

									{/* Actual Video (file upload) */}
									{!!videoFile && attributes.videoSource === "file" && (
										<video
											className="w-full! h-full! object-cover col-1 row-1"
											playsInline
											controls
											preload="none"
										>
											<source src={videoFile.source_url} />
										</video>
									)}

									{/* Embedded Video (YouTube/Vimeo) */}
									{!!attributes.videoId &&
										["vimeo", "youtube"].includes(attributes.videoSource) && (
											<div
												className="w-full h-full embed-video-container *:w-full *:h-full col-1 row-1 *:bg-black"
												data-source={attributes.videoSource}
												data-video-id={attributes.videoId}
											>
												{/* Iframe inserted here when play button clicked */}
											</div>
										)}
								</div>
							)}
						</div>
					)}

					{/* Accordion items - position changes based on variation */}
					<div
						className={cn({
							"self-start relative": true,
							"md:col-2": !isWithMedia,
							"md:col-2 md:row-2 order-4 md:order-none": isWithMedia,
							hidden: !displayContent && !hasInnerBlocks
						})}
					>
						<Appender />

						<div
							{...useInnerBlocksProps(
								{
									className: "flex flex-col gap-4",
									"data-exclusive-mode": attributes.exclusiveMode,
									"data-always-one-open": attributes.alwaysOneOpen
								},
								{
									allowedBlocks: ["takt/accordion-item"],
									template: [["takt/accordion-item"]],
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
