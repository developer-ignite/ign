import { __ } from "@wordpress/i18n";
import { useBlockProps } from "@wordpress/block-editor";
import { shouldDisplay } from "@taktdev/utilities";
import { AdvancedRichText } from "@taktdev/components";
import { ThemeButton } from "parts/ThemeButton";

type ButtonItem = {
	url?: string;
	postId?: number | null;
	postType?: string | null;
	opensInNewTab?: boolean;
	variation?: string;
	title?: string;
	label?: string;
};

type Error404Attributes = {
	anchor?: string;
	heading?: string;
	description?: string;
	buttons?: ButtonItem[];
};

type EditProps = {
	attributes: Error404Attributes;
	setAttributes: (attrs: Partial<Error404Attributes>) => void;
	clientId: string;
};

export default function Edit({ attributes, setAttributes }: EditProps) {
	const { displayContent } = shouldDisplay();

	const hasTextContent = displayContent || !!attributes.heading || !!attributes.description;
	const hasButtons = displayContent || !!attributes.buttons?.some((btn) => btn.url || btn.postId);

	return (
		<section
			{...useBlockProps({
				className: "error-404 pt-20 pb-40 text-center not-discourse"
			})}
		>
			<div className="container grid grid-cols-1 gap-12">
				{hasTextContent && (
					<div className="flex flex-col gap-6">
						{(displayContent || !!attributes.heading) && (
							<AdvancedRichText
								tagName="h1"
								className="text-header-0 leading-none"
								value={attributes.heading || ""}
								allowedFormats={[]}
								placeholder={__("404", "takt")}
								onChange={(value: string) => setAttributes({ heading: value })}
							/>
						)}

						{(displayContent || !!attributes.description) && (
							<AdvancedRichText
								tagName="p"
								className="text-body-large max-w-[600px] mx-auto"
								value={attributes.description || ""}
								allowedFormats={[]}
								placeholder={__("Enter a description…", "takt")}
								onChange={(value: string) => setAttributes({ description: value })}
							/>
						)}
					</div>
				)}

				{hasButtons && (
					<div className="relative flex flex-wrap items-center justify-center gap-4">
						{attributes.buttons?.map((btn, index) => (
							<ThemeButton
								key={index}
								link={{
									title: btn.title || "",
									url: btn.url || "",
									postId: btn.postId ?? null,
									opensInNewTab: btn.opensInNewTab ?? false,
									label: btn.label || ""
								}}
								variation={btn.variation as "primary" | "secondary" | "tertiary"}
								allowVariationChange={false}
								onChange={(value) => {
									const updatedButtons = [...(attributes.buttons || [])];
									updatedButtons[index] = {
										...updatedButtons[index],
										...value
									};
									setAttributes({
										buttons: updatedButtons
									});
								}}
							/>
						))}
					</div>
				)}
			</div>
		</section>
	);
}
