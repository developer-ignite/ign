import { __ } from "@wordpress/i18n";
import { registerPlugin } from "@wordpress/plugins";
import { PluginDocumentSettingPanel, store as coreEditorStore } from "@wordpress/editor";
import { useSelect, useDispatch } from "@wordpress/data";
import { __experimentalVStack as VStack } from "@wordpress/components";
import { MediaUploadPanel } from "@taktdev/components";

const POST_TYPES = ["post", "team_member"];

const FeaturedImagePanel = () => {
	const postType = useSelect((select) => select(coreEditorStore).getCurrentPostType(), []);
	const meta = useSelect((select) => select(coreEditorStore).getEditedPostAttribute("meta"), []);
	const postThumbnail = useSelect(
		(select) => select(coreEditorStore).getEditedPostAttribute("featured_media"),
		[]
	);

	if (!POST_TYPES.includes(postType)) return null;

	const { editPost } = useDispatch(coreEditorStore);

	return (
		<>
			<PluginDocumentSettingPanel
				title={__("Featured Image", "takt")}
				name="takt-featured-image-panel"
			>
				<VStack>
					<MediaUploadPanel
						media={{
							id: postThumbnail || meta._thumbnail_id,
							focalPoint: meta.focal_point
						}}
						onSelect={(image) => {
							editPost({
								featured_media: image?.id || null,
								meta: {
									...meta,
									_thumbnail_id: image?.id || null,
									focal_point: image?.focalPoint
								}
							});
						}}
					/>
				</VStack>
			</PluginDocumentSettingPanel>
		</>
	);
};

registerPlugin("takt-featured-image-panel", {
	render: FeaturedImagePanel,
	icon: null
});
