import { useBlockProps } from "@wordpress/block-editor";
import { renameBlock } from "@taktdev/utilities";
import ThemeButton from "parts/ThemeButton";

export default function Edit({ attributes, setAttributes, clientId }) {
	return (
		<>
			<ThemeButton
				{...useBlockProps({ className: "not-discourse" })}
				link={attributes.button}
				variation={attributes.button.variation}
				onChange={(value) => {
					renameBlock(value.title, attributes.button.title, clientId);
					setAttributes({
						button: value
					});
				}}
			/>
		</>
	);
}
