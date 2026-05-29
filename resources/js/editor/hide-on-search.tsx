import { __ } from "@wordpress/i18n";
import { PluginDocumentSettingPanel, store as coreEditorStore } from "@wordpress/editor";
import { registerPlugin } from "@wordpress/plugins";
import { useSelect, useDispatch } from "@wordpress/data";
import { ToggleControl } from "@wordpress/components";

const META_KEY = "_takt_hide_on_search";
const POST_TYPES = ["page"];

type Meta = {
	[META_KEY]?: boolean;
};

const HideOnSearchPanel = () => {
	const postType = useSelect(
		(select) => select(coreEditorStore).getCurrentPostType(),
		[]
	);

	const meta: Meta = useSelect(
		(select) => select(coreEditorStore).getEditedPostAttribute("meta") || {},
		[]
	);

	const { editPost } = useDispatch(coreEditorStore);

	if (!postType || !POST_TYPES.includes(postType)) {
		return null;
	}

	const isHidden = !!meta[META_KEY];

	return (
		<PluginDocumentSettingPanel
			name="takt-hide-on-search-panel"
			title={__("Search Visibility", "takt")}
		>
			<ToggleControl
				label={__("Hide on Search", "takt")}
				help={
					isHidden
						? __(
								"Page is hidden from on-site search results and search engines (noindex, nofollow). Useful for Thank You / confirmation pages.",
								"takt"
						  )
						: __(
								"Enable to hide this page from on-site search results and search engines. Use for Thank You / confirmation pages that should only be reached via a workflow.",
								"takt"
						  )
				}
				checked={isHidden}
				onChange={(value) =>
					editPost({ meta: { ...meta, [META_KEY]: value } })
				}
				__nextHasNoMarginBottom
			/>
		</PluginDocumentSettingPanel>
	);
};

registerPlugin("takt-hide-on-search-panel", {
	render: HideOnSearchPanel,
	icon: null
});
