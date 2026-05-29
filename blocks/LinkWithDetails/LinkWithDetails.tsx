import { __ } from "@wordpress/i18n";
import { useBlockProps, RichText } from "@wordpress/block-editor";
import { shouldDisplay, renameBlock } from "@taktdev/utilities";
import { ThemeButton } from "parts/ThemeButton";

type ButtonItem = {
	title: string;
	url: string;
	variation: string;
	opensInNewTab?: boolean;
	label?: string;
};

type LinkWithDetailsAttributes = {
	anchor?: string;
	headline: string;
	description: string;
	buttons: ButtonItem[];
};

type EditProps = {
	attributes: LinkWithDetailsAttributes;
	setAttributes: (attrs: Partial<LinkWithDetailsAttributes>) => void;
	clientId: string;
};

export default function Edit({ attributes, setAttributes, clientId }: EditProps) {
	const { displayContent } = shouldDisplay();
	const button = attributes.buttons?.[0];

	return (
		<div
			{...useBlockProps({
				className:
					"link-with-details discourse-item not-discourse flex flex-col gap-6 [.link-with-details+&]:border-t [.link-with-details+&]:border-charcoal [.link-with-details+&]:mt-8! [.link-with-details+&]:pt-8 [&:has(+.link-with-details)]:mb-0!"
			})}
		>
			<RichText
				tagName="h3"
				className="text-header-5"
				placeholder={__("Enter headline…", "takt")}
				value={attributes.headline}
				onChange={(value) => {
					renameBlock(value, attributes.headline, clientId);
					setAttributes({ headline: value });
				}}
				allowedFormats={[]}
			/>

			{(displayContent || !!attributes.description) && (
				<RichText
					tagName="p"
					className="text-body font-medium"
					placeholder={__("Enter description…", "takt")}
					value={attributes.description}
					onChange={(value) => setAttributes({ description: value })}
					allowedFormats={["core/bold", "core/italic", "core/link"]}
				/>
			)}

			<div>
				<ThemeButton
					link={button}
					variation="tertiary"
					allowVariationChange={false}
					onChange={(value) => {
						const updated = { ...button, ...value };
						setAttributes({ buttons: [updated] });
					}}
				/>
			</div>
		</div>
	);
}
