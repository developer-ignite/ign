import { registerPlugin } from "@wordpress/plugins";
import { PluginDocumentSettingPanel, store as coreEditorStore } from "@wordpress/editor";
import { useSelect, useDispatch } from "@wordpress/data";
import { ColorPalette } from "@wordpress/components";
import { useEffect } from "react";
import { __ } from "@wordpress/i18n";
import { ThemeColors, ColorClass, ColorValue } from "../../../parts/ThemeColors";

const POST_TYPES = ["post", "page", "tribe_events", "landing_page", "testimonial", "wp_template"];

const COLOR_CLASSES = ["neon-green", "blue", "green", "yellow", "orange", "purple"];

const AccentColorPanel = () => {
	const { colorOptions } = ThemeColors();

	const postType = useSelect((select) => select(coreEditorStore).getCurrentPostType(), []);

	const meta = useSelect((select) => select(coreEditorStore).getEditedPostAttribute("meta"), []);

	// For wp_template, accent_color is a top-level REST field (not under meta)
	// because WP_REST_Templates_Controller doesn't surface post-meta.
	const templateAccentColor = useSelect(
		(select) =>
			postType === "wp_template"
				? select(coreEditorStore).getEditedPostAttribute("accent_color")
				: null,
		[postType]
	);

	const { editPost } = useDispatch(coreEditorStore);

	const isTemplate = postType === "wp_template";
	const accentColor = isTemplate
		? templateAccentColor || "neon-green"
		: meta?.accent_color || "neon-green";

	useEffect(() => {
		const applyAccentClass = () => {
			const editorFrame = document.querySelector(
				'iframe[name="editor-canvas"]'
			) as HTMLIFrameElement | null;

			if (editorFrame?.contentDocument?.body) {
				const body = editorFrame.contentDocument.body;
				COLOR_CLASSES.forEach((c) => body.classList.remove(c));
				body.classList.add(accentColor);
				return true;
			}
			return false;
		};

		if (!applyAccentClass()) {
			const interval = setInterval(() => {
				if (applyAccentClass()) {
					clearInterval(interval);
				}
			}, 100);

			return () => clearInterval(interval);
		}
	}, [accentColor]);

	if (!postType || !POST_TYPES.includes(postType)) {
		return null;
	}

	const currentValue = ColorValue(accentColor);

	return (
		<PluginDocumentSettingPanel name="ign-accent-color-panel" title={__("Accent Color", "takt")}>
			<ColorPalette
				colors={colorOptions}
				value={currentValue}
				onChange={(color) => {
					if (color) {
						const newColor = ColorClass(color);
						if (isTemplate) {
							editPost({ accent_color: newColor });
						} else {
							editPost({ meta: { ...meta, accent_color: newColor } });
						}
					}
				}}
				disableCustomColors={true}
				clearable={false}
			/>
		</PluginDocumentSettingPanel>
	);
};

registerPlugin("ign-accent-color-panel", {
	render: AccentColorPanel,
	icon: null
});
