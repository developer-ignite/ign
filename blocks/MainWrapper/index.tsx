import { registerBlockType } from "@wordpress/blocks";
import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";
import metadata from "./block.json";
import { homeButton } from "@wordpress/icons";

registerBlockType(metadata.name, {
	icon: homeButton,
	edit: function Edit() {
		const blockProps = useBlockProps({ className: "not-discourse" });
		return (
			<main {...blockProps}>
				<InnerBlocks />
			</main>
		);
	},
	save: () => {
		const { className, ...blockProps } = useBlockProps.save();
		return (
			<main {...blockProps}>
				<InnerBlocks.Content />
			</main>
		);
	}
});
