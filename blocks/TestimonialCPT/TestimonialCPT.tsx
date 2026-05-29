import { __ } from "@wordpress/i18n";
import { useBlockProps, RichText, InspectorControls } from "@wordpress/block-editor";
import { useSelect, useDispatch } from "@wordpress/data";
import { store as coreEditorStore } from "@wordpress/editor";
import { store as coreStore } from "@wordpress/core-data";
import {
	PanelBody,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	TextControl
} from "@wordpress/components";
import { useEffect } from "@wordpress/element";
import { MediaUploadPanel } from "@taktdev/components";
import { ReactComponent as TertiaryArrow } from "resources/images/tertiary-arrow.svg";

type Meta = {
	name?: string;
	message?: string;
	videoSource?: string;
	videoFile?: number;
	videoId?: string;
};

type Term = {
	id: number;
	name: string;
};

export default function TestimonialCPT() {
	const blockProps = useBlockProps({ className: "testimonial-cpt not-discourse" });

	const postType = useSelect((select) => select(coreEditorStore).getCurrentPostType(), []);

	const meta: Meta = useSelect(
		(select) => select(coreEditorStore).getEditedPostAttribute("meta") || {},
		[]
	);

	const postId = useSelect((select) => select(coreEditorStore).getCurrentPostId(), []);

	const programTerms: Term[] = useSelect(
		(select) => {
			if (!postId) {
				return [];
			}
			// @ts-ignore
			const post = select(coreStore).getEditedEntityRecord("postType", "testimonial", postId);
			const termIds: number[] = post?.program || [];
			if (!termIds.length) {
				return [];
			}
			return termIds
				.map((id: number) => {
					// @ts-ignore
					const term = select(coreStore).getEntityRecord("taxonomy", "program", id);
					return term ? { id: term.id, name: term.name } : null;
				})
				.filter(Boolean) as Term[];
		},
		[postId]
	);

	const programName = programTerms.length > 0 ? programTerms[0].name : "";

	const { editPost } = useDispatch(coreEditorStore);

	const updateMeta = (field: string, value: string | number) => {
		editPost({ meta: { ...meta, [field]: value } });
	};

	useEffect(() => {
		if (meta.name) {
			editPost({ title: meta.name });
		}
	}, [meta.name, editPost]);

	if (postType !== "testimonial") {
		return null;
	}

	const videoSource = meta.videoSource || "file";
	const hasVideo =
		(videoSource === "file" && !!meta.videoFile) ||
		((videoSource === "youtube" || videoSource === "vimeo") && !!meta.videoId);

	return (
		<>
			<InspectorControls>
				<PanelBody title={__("Video Settings", "takt")} initialOpen={true}>
					<ToggleGroupControl
						label={__("Video Source", "takt")}
						value={videoSource}
						onChange={(value) => updateMeta("videoSource", value as string)}
						isBlock
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					>
						<ToggleGroupControlOption value="file" label={__("File", "takt")} />
						<ToggleGroupControlOption value="youtube" label={__("YouTube", "takt")} />
						<ToggleGroupControlOption value="vimeo" label={__("Vimeo", "takt")} />
					</ToggleGroupControl>
					{videoSource === "file" && (
						<MediaUploadPanel
							media={meta.videoFile}
							label={__("Video File", "takt")}
							allowedTypes={["video"]}
							onSelect={(media) => updateMeta("videoFile", media.id)}
							enableFocalPoint={false}
						/>
					)}
					{(videoSource === "youtube" || videoSource === "vimeo") && (
						<TextControl
							label={
								videoSource === "youtube"
									? __("YouTube Video ID", "takt")
									: __("Vimeo Video ID", "takt")
							}
							value={meta.videoId || ""}
							onChange={(value) => updateMeta("videoId", value)}
							placeholder={__("e.g. dQw4w9WgXcQ", "takt")}
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
					)}
				</PanelBody>
			</InspectorControls>

			{/* Card preview — mirrors parts/card-testimonial.php */}
			<div {...blockProps} style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
				<div className="flex flex-col h-full bg-accent rounded-3xl p-6 max-w-[400px] mx-auto">
					<div className="flex flex-col gap-6 pb-8 flex-1">
						<RichText
							tagName="h3"
							className="font-heading text-[1.5rem] md:text-[2.5rem] leading-[1.1] text-charcoal"
							value={meta.name || ""}
							onChange={(value) => updateMeta("name", value)}
							placeholder={__("Name\u2026", "takt")}
							allowedFormats={[]}
						/>

						{programName && (
							<p className="text-header-5 text-charcoal leading-[1.15]">{programName}</p>
						)}

						<RichText
							tagName="blockquote"
							className="text-body font-medium italic text-charcoal leading-normal"
							value={meta.message || ""}
							onChange={(value) => updateMeta("message", value)}
							placeholder={__("Testimonial message\u2026", "takt")}
						/>
					</div>

					{hasVideo && (
						<div className="flex items-center gap-2 text-charcoal font-medium text-body uppercase mt-auto">
							{__("Watch the Video", "takt")}
							<span className="w-5 h-4 *:w-full *:h-full">
								<TertiaryArrow />
							</span>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
