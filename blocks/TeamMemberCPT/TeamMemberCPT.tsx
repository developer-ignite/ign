import { __ } from "@wordpress/i18n";
import { useBlockProps, RichText } from "@wordpress/block-editor";
import { useSelect, useDispatch } from "@wordpress/data";
import { store as coreEditorStore } from "@wordpress/editor";
import { store as coreStore } from "@wordpress/core-data";
import { useEffect } from "@wordpress/element";
import { ImageDropUploader, Button } from "@taktdev/components";
import { ReactComponent as TertiaryArrow } from "resources/images/tertiary-arrow.svg";

type ContactLink = {
	url?: string;
	postId?: number | null;
	postType?: string | null;
	opensInNewTab?: boolean;
	title?: string;
	label?: string;
};

type Meta = {
	first_name?: string;
	last_name?: string;
	bio?: string;
	collapse_bio?: boolean;
	contact_link?: ContactLink;
	_thumbnail_id?: number | null;
	focal_point?: { x: number; y: number };
};

type Term = {
	id: number;
	name: string;
};

const DEFAULT_CONTACT_LINK: ContactLink = {
	url: "",
	postId: null,
	postType: null,
	opensInNewTab: true,
	title: "",
	label: ""
};

export default function TeamMemberCPT() {
	const blockProps = useBlockProps({ className: "team-member-cpt not-discourse" });

	const postType = useSelect((select) => select(coreEditorStore).getCurrentPostType(), []);

	const meta: Meta = useSelect(
		(select) => select(coreEditorStore).getEditedPostAttribute("meta") || {},
		[]
	);

	const excerpt: string = useSelect(
		(select) => select(coreEditorStore).getEditedPostAttribute("excerpt") || "",
		[]
	);

	const postId = useSelect((select) => select(coreEditorStore).getCurrentPostId(), []);

	const featuredMediaId: number = useSelect(
		(select) => select(coreEditorStore).getEditedPostAttribute("featured_media") || 0,
		[]
	);

	const departmentTerms: Term[] = useSelect(
		(select) => {
			if (!postId) {
				return [];
			}
			// @ts-ignore
			const post = select(coreStore).getEditedEntityRecord("postType", "team_member", postId);
			const termIds: number[] = post?.department || [];
			if (!termIds.length) {
				return [];
			}
			return termIds
				.map((id: number) => {
					// @ts-ignore
					const term = select(coreStore).getEntityRecord("taxonomy", "department", id);
					return term ? { id: term.id, name: term.name } : null;
				})
				.filter(Boolean) as Term[];
		},
		[postId]
	);

	const departmentName = departmentTerms.length > 0 ? departmentTerms[0].name : "";

	const { editPost } = useDispatch(coreEditorStore);

	const updateMeta = (field: string, value: string) => {
		editPost({ meta: { ...meta, [field]: value } });
	};

	const firstName = meta.first_name || "";
	const lastName = meta.last_name || "";

	const contactLink = { ...DEFAULT_CONTACT_LINK, ...meta.contact_link };

	const updateContactLink = (changes: Partial<ContactLink>) => {
		editPost({
			meta: {
				...meta,
				contact_link: { ...contactLink, ...changes, opensInNewTab: true }
			}
		});
	};

	useEffect(() => {
		const fullName = [firstName, lastName].filter(Boolean).join(" ");
		editPost({ title: fullName });
	}, [firstName, lastName, editPost]);

	if (postType !== "team_member") {
		return null;
	}

	return (
		<div {...blockProps} style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
			<div className="flex flex-col h-full text-charcoal max-w-[400px] mx-auto">
				{/* Photo area — mirrors card-team-member.php photo section */}
				<div className="p-4 rounded-3xl overflow-hidden bg-accent">
					<div className="overflow-hidden rounded-xl">
						<ImageDropUploader
							image={{
								id: meta._thumbnail_id || featuredMediaId || null,
								focalPoint: meta.focal_point
							}}
							onSelect={(selected) =>
								editPost({
									featured_media: selected.id || null,
									meta: {
										...meta,
										_thumbnail_id: selected.id || null,
										focal_point: selected.focalPoint
									}
								})
							}
							className="w-full!"
							imageClassName="w-full! aspect-[395/317]! object-cover!"
							placeholderClassName="w-full aspect-[395/317]"
						/>
					</div>
				</div>

				<div className="flex flex-1 flex-col gap-6 p-6 rounded-3xl overflow-hidden bg-accent">
					{/* Department badge — read-only */}
					{departmentName && (
						<span className="inline-block bg-white/80 border border-accent text-charcoal text-body-small uppercase font-medium tracking-wider px-2 py-1.5 rounded-full w-fit">
							{departmentName}
						</span>
					)}

					{/* Name — two inline RichText fields styled as h3 */}
					<div className="text-header-3 flex gap-2 flex-wrap">
						<RichText
							tagName="span"
							className="inline-block min-w-[6rem]"
							value={firstName}
							onChange={(value) => updateMeta("first_name", value)}
							placeholder={__("First name", "takt")}
							allowedFormats={[]}
						/>
						<RichText
							tagName="span"
							className="inline-block min-w-[6rem]"
							value={lastName}
							onChange={(value) => updateMeta("last_name", value)}
							placeholder={__("Last name", "takt")}
							allowedFormats={[]}
						/>
					</div>

					{/* Job Title — uses post excerpt */}
					<RichText
						tagName="div"
						className="text-header-5"
						value={excerpt}
						onChange={(value) => editPost({ excerpt: value })}
						placeholder={__("Job Title", "takt")}
						allowedFormats={[]}
					/>

					{/* Bio */}
					<RichText
						tagName="p"
						className="text-body font-sans"
						value={meta.bio || ""}
						onChange={(value) => updateMeta("bio", value)}
						placeholder={__("Bio", "takt")}
						allowedFormats={[]}
					/>

					{/* Contact link button — tertiary style */}
					<div className="mt-auto pt-2">
						<Button
							link={contactLink}
							onChange={(value) => updateContactLink(value)}
							variation="tertiary"
							allowVariationChange={false}
							className="btn-tertiary text-charcoal!"
							placeholder={__("Get In Touch", "takt")}
							after={
								<span className="btn-tertiary-arrow w-5 h-4 *:w-full *:h-full">
									<TertiaryArrow />
								</span>
							}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
