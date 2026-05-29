import { __ } from "@wordpress/i18n";
import { useEffect, useState } from "@wordpress/element";
import { cn, renameBlock } from "@taktdev/utilities";
import { useBlockProps, InspectorControls } from "@wordpress/block-editor";
import {
	Button,
	PanelBody,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	RadioControl
} from "@wordpress/components";
import { FilteredServerSideRender } from "@taktdev/components";
import apiFetch from "@wordpress/api-fetch";
import { ThemeHeading } from "parts/ThemeHeading";

type FormAttributes = {
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
	headingPosition: "beside" | "above";
	formId?: string;
};

type EditProps = {
	attributes: FormAttributes;
	setAttributes: (attrs: Partial<FormAttributes>) => void;
	clientId: string;
};

type FormOption = {
	id: number;
	title: string;
};

export default function Edit({ attributes, setAttributes, clientId }: EditProps) {
	const [forms, setForms] = useState<FormOption[]>([]);

	useEffect(() => {
		apiFetch<{ id: number; title: string }[]>({ path: "/gf/v2/forms" })
			.then((response) => {
				setForms(Object.values(response));
			})
			.catch(() => {
				setForms([]);
			});
	}, []);

	return (
		<>
			<InspectorControls>
				<PanelBody title={__("Form", "takt")} initialOpen={true}>
					<RadioControl
						label={__("Form to Display", "takt")}
						selected={attributes.formId}
						options={forms.map((form) => ({
							label: form.title,
							value: form.id.toString()
						}))}
						onChange={(value) => setAttributes({ formId: value })}
					/>
					<div
						style={{
							display: "flex",
							justifyContent: "flex-end"
						}}
					>
						<Button variant="tertiary" onClick={() => setAttributes({ formId: "" })}>
							{__("Clear", "takt")}
						</Button>
					</div>
				</PanelBody>

				<PanelBody title={__("Appearance", "takt")} initialOpen={true}>
					<ToggleGroupControl
						label={__("Heading Position", "takt")}
						value={attributes.headingPosition}
						onChange={(value) =>
							setAttributes({
								headingPosition: value as "beside" | "above"
							})
						}
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					>
						<ToggleGroupControlOption value="beside" label={__("Beside", "takt")} />
						<ToggleGroupControlOption value="above" label={__("Above", "takt")} />
					</ToggleGroupControl>
				</PanelBody>
			</InspectorControls>

			<section
				{...useBlockProps({
					className: "form-block py-6 sm:py-16 not-discourse"
				})}
			>
				<div
					className={cn({
						"container grid grid-cols-1 gap-x-20 gap-y-16": true,
						"max-w-175": attributes.headingPosition === "above",
						"md:grid-cols-2 relative": attributes.headingPosition === "beside"
					})}
				>
					<ThemeHeading
						className={cn({
							"md:sticky md:top-[calc(var(--fixed-elements-height)+24px)] self-start":
								attributes.headingPosition === "beside"
						})}
						alignment={attributes.headingPosition === "above" ? "center" : "left"}
						eyebrow={attributes.eyebrow}
						heading={attributes.heading}
						headingSize={2}
						description={attributes.description}
						buttons={attributes.buttons}
						onChange={(value: Partial<FormAttributes>) => {
							renameBlock(value.heading, attributes.heading, clientId);
							setAttributes(value);
						}}
					/>

					<div
						className={cn({
							"relative self-start": true,
							"md:col-2": attributes.headingPosition === "beside"
						})}
					>
						<FilteredServerSideRender
							querySelector=".form-section-form"
							className="form-section-form"
						/>
					</div>
				</div>
			</section>
		</>
	);
}
