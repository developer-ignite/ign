import { __ } from "@wordpress/i18n";
import { useBlockProps, InspectorControls, RichText } from "@wordpress/block-editor";
import {
	PanelBody,
	ToggleControl,
	RangeControl,
	TextControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption
} from "@wordpress/components";
import { renameBlock } from "@taktdev/utilities";
import { FilteredServerSideRender } from "@taktdev/components";

type SearchAttributes = {
	anchor?: string;
	heading?: string;
	searchPlaceholder?: string;
	displayFilters: boolean;
	displayPerPage: boolean;
	postsPerPage: number;
	paginationMode: string;
};

type EditProps = {
	attributes: SearchAttributes;
	setAttributes: (attrs: Partial<SearchAttributes>) => void;
	clientId: string;
};

export default function Edit({ attributes, setAttributes, clientId }: EditProps) {
	return (
		<>
			<InspectorControls>
				<PanelBody title={__("Search Settings", "takt")} initialOpen={true}>
					<TextControl
						label={__("Search placeholder", "takt")}
						value={attributes.searchPlaceholder}
						onChange={(value) => setAttributes({ searchPlaceholder: value })}
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<ToggleControl
						label={__("Display filters", "takt")}
						checked={attributes.displayFilters}
						onChange={(value) => setAttributes({ displayFilters: value })}
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={__("Display per page selector", "takt")}
						checked={attributes.displayPerPage}
						onChange={(value) => setAttributes({ displayPerPage: value })}
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={__("Posts per page", "takt")}
						value={attributes.postsPerPage}
						onChange={(value) => setAttributes({ postsPerPage: value })}
						min={3}
						max={30}
						step={3}
						__nextHasNoMarginBottom
					/>
					<ToggleGroupControl
						label={__("Pagination mode", "takt")}
						value={attributes.paginationMode}
						onChange={(value) => setAttributes({ paginationMode: value })}
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					>
						<ToggleGroupControlOption value="load-more" label={__("Load More", "takt")} />
						<ToggleGroupControlOption value="pagination" label={__("Pagination", "takt")} />
					</ToggleGroupControl>
				</PanelBody>
			</InspectorControls>

			<section
				{...useBlockProps({
					className: "search py-gap-8 not-discourse",
					"data-pagination-mode": attributes.paginationMode
				})}
			>
				<div className="container grid grid-cols-1 gap-gap-7">
					<RichText
						tagName="h2"
						className="text-header-1"
						placeholder={__("Enter heading…", "takt")}
						value={attributes.heading}
						onChange={(value) => {
							renameBlock(value, attributes.heading, clientId);
							setAttributes({ heading: value });
						}}
					/>

					<FilteredServerSideRender
						querySelector=".search-inner"
						className="search-inner grid grid-cols-1 gap-gap-5"
					/>
				</div>
			</section>
		</>
	);
}
