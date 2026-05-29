import { __ } from "@wordpress/i18n";
import { PluginDocumentSettingPanel, store as coreEditorStore } from "@wordpress/editor";
import { registerPlugin } from "@wordpress/plugins";
import { useSelect, useDispatch } from "@wordpress/data";
import {
	TextControl,
	TextareaControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption
} from "@wordpress/components";
import { MediaUploadPanel } from "@taktdev/components";

type Meta = {
	name?: string;
	message?: string;
	videoSource?: string;
	videoFile?: number;
	videoId?: string;
};

const TestimonialPanel = () => {
	const postType = useSelect((select) => select(coreEditorStore).getCurrentPostType(), []);

	const meta: Meta = useSelect(
		(select) => select(coreEditorStore).getEditedPostAttribute("meta") || {},
		[]
	);

	const { editPost } = useDispatch(coreEditorStore);

	if (postType !== "testimonial") {
		return null;
	}

	const updateMeta = (field: string, value: string | number) => {
		editPost({ meta: { ...meta, [field]: value } });
	};

	const videoSource = meta.videoSource || "file";
	const videoLabel =
		videoSource === "youtube" ? __("YouTube Video ID", "takt") : __("Vimeo Video ID", "takt");

	return (
		<PluginDocumentSettingPanel
			name="testimonial-settings"
			title={__("Testimonial Settings", "takt")}
		>
			<>
				<TextControl
					label={__("Name", "takt")}
					value={meta.name || ""}
					onChange={(value) => updateMeta("name", value)}
					placeholder={__("Enter the person's name\u2026", "takt")}
					__nextHasNoMarginBottom
					__next40pxDefaultSize
				/>
				<TextareaControl
					label={__("Message", "takt")}
					value={meta.message || ""}
					onChange={(value) => updateMeta("message", value)}
					placeholder={__("Enter the testimonial message\u2026", "takt")}
					rows={4}
					__nextHasNoMarginBottom
				/>
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
						label={videoLabel}
						value={meta.videoId || ""}
						onChange={(value) => updateMeta("videoId", value)}
						placeholder={__("e.g. dQw4w9WgXcQ", "takt")}
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
				)}
			</>
		</PluginDocumentSettingPanel>
	);
};

registerPlugin("testimonial-cpt-panel", {
	render: TestimonialPanel,
	icon: null
});
