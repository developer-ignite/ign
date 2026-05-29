import { __ } from "@wordpress/i18n";
import { useBlockProps, InspectorControls } from "@wordpress/block-editor";
import {
	PanelBody,
	ToggleControl,
	RangeControl,
	TextControl,
	BaseControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption
} from "@wordpress/components";
import { renameBlock } from "@taktdev/utilities";
import {
	FilteredServerSideRender,
	PostSelectorSortable,
	TaxonomyMultiSelect
} from "@taktdev/components";
import { ThemeHeading } from "parts/ThemeHeading";

type FeaturedEventsAttributes = {
	anchor?: string;
	eyebrow: string;
	heading: string;
	description: string;
	postsSource: string;
	selectedPosts: number[];
	postsLimit: number;
	eventList: string;
	selectedEventCategories: number[];
	selectedTags: number[];
	hideIfEmpty: boolean;
	buttonLabel: string;
};

type EditProps = {
	attributes: FeaturedEventsAttributes;
	setAttributes: (attrs: Partial<FeaturedEventsAttributes>) => void;
	clientId: string;
};

export default function Edit({ attributes, setAttributes, clientId }: EditProps) {
	return (
		<>
			<InspectorControls>
				<PanelBody title={__("Content", "takt")} initialOpen={true}>
					<ToggleGroupControl
						label={__("Selection Mode", "takt")}
						value={attributes.postsSource}
						onChange={(value) => setAttributes({ postsSource: value as string })}
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					>
						<ToggleGroupControlOption value="automatic" label={__("Automatic", "takt")} />
						<ToggleGroupControlOption value="manual" label={__("Manual", "takt")} />
					</ToggleGroupControl>

					{attributes.postsSource === "manual" && (
						<BaseControl
							id="featured-events-selected-content"
							label={__("Selected Events", "takt")}
							__nextHasNoMarginBottom
						>
							<PostSelectorSortable
								value={attributes.selectedPosts}
								onChange={(value) => {
									let selectedPosts: number[] = [];
									if (Array.isArray(value)) {
										selectedPosts = value;
									} else if (value) {
										selectedPosts = [value as number];
									}
									setAttributes({ selectedPosts });
								}}
								postTypes={["tribe_events"]}
							/>
						</BaseControl>
					)}

					{attributes.postsSource === "automatic" && (
						<>
							<ToggleGroupControl
								label={__("Show events in the", "takt")}
								value={attributes.eventList}
								onChange={(value) => setAttributes({ eventList: value as string })}
								__nextHasNoMarginBottom
								__next40pxDefaultSize
							>
								<ToggleGroupControlOption value="future" label={__("Future", "takt")} />
								<ToggleGroupControlOption value="past" label={__("Past", "takt")} />
							</ToggleGroupControl>

							<TaxonomyMultiSelect
								title={__("Event Category", "takt")}
								value={attributes.selectedEventCategories}
								taxonomy="tribe_events_cat"
								onChange={(value) => setAttributes({ selectedEventCategories: value })}
							/>

							<TaxonomyMultiSelect
								title={__("Tags", "takt")}
								value={attributes.selectedTags}
								taxonomy="post_tag"
								onChange={(value) => setAttributes({ selectedTags: value })}
							/>

							<RangeControl
								label={__("Number of events to display", "takt")}
								value={attributes.postsLimit}
								onChange={(value) => setAttributes({ postsLimit: value })}
								min={1}
								max={20}
								__nextHasNoMarginBottom
								__next40pxDefaultSize
							/>

							<ToggleControl
								label={__("Hide if empty", "takt")}
								help={__("Hides the section if no events are found.", "takt")}
								checked={attributes.hideIfEmpty}
								onChange={(value) => setAttributes({ hideIfEmpty: value })}
								__nextHasNoMarginBottom
							/>
						</>
					)}

					<TextControl
						label={__("Button Label", "takt")}
						value={attributes.buttonLabel}
						onChange={(value) => setAttributes({ buttonLabel: value })}
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
				</PanelBody>
			</InspectorControls>

			<section
				{...useBlockProps({
					className: "featured-events not-discourse"
				})}
			>
				<div className="container">
					<ThemeHeading
						className="mb-16"
						eyebrow={attributes.eyebrow}
						heading={attributes.heading}
						headingSize={2}
						description={attributes.description}
						columns={2}
						enableButtons={false}
						enableDescription={true}
						onChange={(value: Partial<FeaturedEventsAttributes>) => {
							renameBlock(value.heading, attributes.heading, clientId);
							setAttributes(value);
						}}
					/>

					<FilteredServerSideRender
						querySelector=".featured-events-list"
						className="featured-events-list flex flex-col gap-6"
					/>
				</div>
			</section>
		</>
	);
}
