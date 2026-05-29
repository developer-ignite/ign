import { __ } from "@wordpress/i18n";
import { useBlockProps, useInnerBlocksProps, RichText } from "@wordpress/block-editor";
import { cn, shouldDisplay, renameBlock } from "@taktdev/utilities";

type DemoContainerAttributes = {
	anchor?: string;
	title?: string;
	description?: string;
};

type EditProps = {
	attributes: DemoContainerAttributes;
	setAttributes: (attrs: Partial<DemoContainerAttributes>) => void;
	clientId: string;
};

export default function Edit({ attributes, setAttributes, clientId }: EditProps) {
	const { displayContent } = shouldDisplay();

	const blockProps = useBlockProps({
		className: "not-discourse demo-container isolate py-8 sm:py-12",
		role: "region",
		"aria-label": attributes.title ? attributes.title.replace(/<[^>]+>/g, "") : undefined
	});

	const innerBlocksProps = useInnerBlocksProps({
		className: "discourse-narrow-container *:first:mt-0! *:last:mb-0!"
	});

	return (
		<div {...blockProps}>
			{(displayContent || attributes.title || attributes.description) && (
				<div className="container">
					<div className="mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-neutral-300">
						<RichText
							tagName="h2"
							className="text-xl font-bold uppercase text-current text-center"
							placeholder={__("Demo title…", "takt")}
							value={attributes.title}
							onChange={(title) => {
								renameBlock(title, attributes.title, clientId);
								setAttributes({ title });
							}}
						/>

						{(displayContent || attributes.description) && (
							<RichText
								tagName="p"
								className="mt-2 text-base opacity-60 max-w-2xl text-center mx-auto"
								placeholder={__("Optional description…", "takt")}
								value={attributes.description}
								onChange={(description) => setAttributes({ description })}
							/>
						)}
					</div>
				</div>
			)}

			<div {...innerBlocksProps} />
		</div>
	);
}
