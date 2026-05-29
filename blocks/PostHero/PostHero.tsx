import { __, sprintf } from "@wordpress/i18n";
import { useEffect, useRef } from "@wordpress/element";
import { useBlockProps, InspectorControls } from "@wordpress/block-editor";
import { PanelBody, ToggleControl } from "@wordpress/components";
import {
	shouldDisplay,
	cn,
	renameBlock,
	isTemplatePreview,
	isTemplateEdit
} from "@taktdev/utilities";
import { decodeEntities } from "@wordpress/html-entities";
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { store as editorStore } from "@wordpress/editor";

type CategoryTerm = {
	id: number;
	name: string;
};

type PostHeroAttributes = {
	anchor?: string;
	showExcerpt: boolean;
	useTopicColor: boolean;
};

type EditProps = {
	attributes: PostHeroAttributes;
	setAttributes: (attrs: Partial<PostHeroAttributes>) => void;
	clientId: string;
};

export default function Edit({ attributes, setAttributes, clientId }: EditProps) {
	const { displayContent } = shouldDisplay();
	const hasHeader = isTemplatePreview() || isTemplateEdit();

	// Fetch current post data
	const post = useSelect((select) => {
		// @ts-ignore
		const currentPostId = select(editorStore).getCurrentPostId();
		// @ts-ignore
		return select(coreStore).getEntityRecord("postType", "post", currentPostId, { _embed: true });
	}, []);

	// Extract post data
	const postTitle = decodeEntities(post?.title?.rendered || "") || __("Post Title", "takt");
	const postExcerpt = post?.excerpt?.rendered
		? decodeEntities(post.excerpt.rendered.replace(/<[^>]+>/g, "").trim())
		: "";
	const featuredMediaUrl = post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;
	const allCategories: CategoryTerm[] = post?._embedded?.["wp:term"]?.[0] || [];
	const postAuthor = post?._embedded?.author?.[0]?.name || __("Post Author", "takt");
	const postDate = post?.date
		? new Date(post.date).toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric"
			})
		: new Date().toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric"
			});

	// Fetch accent colors for all categories
	const categoryAccentColors = useSelect(
		(select) => {
			if (!allCategories.length) {
				return {} as Record<number, string>;
			}
			const colors: Record<number, string> = {};
			for (const cat of allCategories) {
				// @ts-ignore
				const term = select(coreStore).getEntityRecord("taxonomy", "category", cat.id);
				colors[cat.id] = term?.meta?.accent_color || "";
			}
			return colors;
		},
		[allCategories.map((c) => c.id).join(",")]
	);

	// First category accent color (for section gradient override)
	const firstAccentColor =
		allCategories.length > 0 ? categoryAccentColors[allCategories[0].id] || "" : "";

	// Rename block based on post title
	const prevTitleRef = useRef(postTitle);
	useEffect(() => {
		if (postTitle !== prevTitleRef.current) {
			renameBlock(postTitle, prevTitleRef.current, clientId);
			prevTitleRef.current = postTitle;
		}
	}, [postTitle, clientId]);

	return (
		<>
			<InspectorControls>
				<PanelBody title={__("Settings", "takt")} initialOpen={true}>
					<ToggleControl
						label={__("Show Excerpt", "takt")}
						help={__("Display the post excerpt below the title.", "takt")}
						checked={attributes.showExcerpt}
						onChange={(value) => setAttributes({ showExcerpt: value })}
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={__("Use Topic Color", "takt")}
						help={__(
							"Use the topic accent color for the gradient instead of the page accent color.",
							"takt"
						)}
						checked={attributes.useTopicColor}
						onChange={(value) => setAttributes({ useTopicColor: value })}
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>

			<section
				{...useBlockProps({
					className: cn({
						"not-discourse": true,
						"post-hero grid overflow-visible min-h-[min(800px,100vh)]": true,
						"-mt-(--header-height)": hasHeader,
						[firstAccentColor]: attributes.useTopicColor && !!firstAccentColor
					})
				})}
			>
				{/* Layer 1: Background image — col-1/row-1, stretches to fill grid */}
				<div className="col-start-1 row-start-1 overflow-hidden bg-accent h-[calc(var(--header-height)+450px)] mask-b-from-40% mask-b-to-100%">
					{(displayContent || featuredMediaUrl) && (
						<>
							{featuredMediaUrl ? (
								<img src={featuredMediaUrl} alt="" className="w-full h-full object-cover" />
							) : (
								<div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
									{__("Featured Image", "takt")}
								</div>
							)}
						</>
					)}
				</div>

				{/* Layer 2: Gradient — col-1/row-1, extends below for subsequent sections */}
				<div className="col-start-1 row-start-1 self-start relative -z-1">
					<div className="top-gradient" />
				</div>

				{/* Layer 3: Content — col-1/row-1, aligned to bottom */}
				<div className="col-start-1 row-start-1 self-end relative z-10 pb-8 sm:pb-16 pt-[calc(var(--header-height)+150px)] md:pt-[var(--header-height)]">
					<div className="container">
						<div className="max-w-[700px] mr-auto">
							{/* Upper Group: Topic Pills + Title */}
							<div className="flex flex-col gap-6">
								{/* Topic Pills */}
								{(displayContent || allCategories.length > 0) && (
									<div className="flex flex-wrap gap-2">
										{allCategories.length > 0 ? (
											allCategories.map((cat) => {
												const accentColor = categoryAccentColors[cat.id] || "";
												return (
													<span
														key={cat.id}
														className={cn({
															"inline-flex items-center justify-center px-2 py-2 rounded-full bg-accent-lighter border border-accent text-sm font-medium uppercase leading-[1.1] whitespace-nowrap shrink-0 text-charcoal": true,
															[accentColor]: !!accentColor
														})}
													>
														{cat.name}
													</span>
												);
											})
										) : (
											<span className="inline-flex items-center justify-center px-2 py-2 rounded-full bg-accent-lighter border border-accent text-sm font-medium uppercase leading-[1.1] whitespace-nowrap shrink-0 text-charcoal">
												{__("Topic", "takt")}
											</span>
										)}
									</div>
								)}

								{/* Post Title */}
								{(displayContent || postTitle) && (
									<h1 className="text-header-3 md:text-header-2 text-charcoal">{postTitle}</h1>
								)}
							</div>

							{/* Excerpt (Optional) */}
							{attributes.showExcerpt && (displayContent || postExcerpt) && (
								<p className="text-body-large text-charcoal mt-6">
									{postExcerpt || __("Post excerpt will appear here…", "takt")}
								</p>
							)}

							{/* Lower Group: Author + Date */}
							<div className="mt-12 flex flex-col gap-1">
								{/* Author Line */}
								<p className="text-lg font-medium leading-[1.2] text-charcoal">
									{sprintf(
										/* translators: %s: author name */
										__("By: %s", "takt"),
										postAuthor
									)}
								</p>

								{/* Date Line */}
								<p className="text-lg font-medium leading-[1.2] text-charcoal">
									{sprintf(
										/* translators: %s: publish date */
										__("Published on: %s", "takt"),
										postDate
									)}
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
