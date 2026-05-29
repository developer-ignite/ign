import { __ } from "@wordpress/i18n";
import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";
import { renameBlock } from "@taktdev/utilities";
import { ThemeHeading } from "parts/ThemeHeading";

type TextAttributes = {
	anchor?: string;
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
};

type EditProps = {
	attributes: TextAttributes;
	setAttributes: (attrs: Partial<TextAttributes>) => void;
	clientId: string;
};

const ALLOWED_BLOCKS = [
	"core/paragraph",
	"core/heading",
	"core/list",
	"core/quote",
	"core/separator",
	"takt/button-row"
];

const TEMPLATE: [string, Record<string, unknown>][] = [
	["core/heading", { level: 3, placeholder: __("Heading", "takt") }],
	["core/paragraph", { placeholder: __("Add your content here…", "takt") }]
];

export default function Edit({ attributes, setAttributes, clientId }: EditProps) {
	return (
		<section
			{...useBlockProps({
				className: "text-block py-6 sm:py-16 not-discourse"
			})}
		>
			<div className="container grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-9 items-start">
				<ThemeHeading
					className="md:sticky md:top-8"
					eyebrow={attributes.eyebrow}
					heading={attributes.heading}
					headingSize={2}
					description={attributes.description}
					buttons={attributes.buttons}
					enableEyebrow={true}
					enableHeading={true}
					enableDescription={true}
					enableButtons={true}
					columns={1}
					onChange={(value: Partial<TextAttributes>) => {
						renameBlock(value.heading, attributes.heading, clientId);
						setAttributes(value);
					}}
				/>

				<div
					className={`discourse md:col-start-2${attributes.eyebrow ? " md:pt-[calc(0.875rem*1.1+1rem)]" : ""}`}
				>
					<InnerBlocks allowedBlocks={ALLOWED_BLOCKS} template={TEMPLATE} templateLock={false} />
				</div>
			</div>
		</section>
	);
}
