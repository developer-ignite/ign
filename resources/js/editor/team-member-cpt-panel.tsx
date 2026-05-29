import { __ } from "@wordpress/i18n";
import { PluginDocumentSettingPanel, store as coreEditorStore } from "@wordpress/editor";
import { LinkControl } from "@wordpress/block-editor";
import { registerPlugin } from "@wordpress/plugins";
import { useSelect, useDispatch } from "@wordpress/data";
import {
	BaseControl,
	Button,
	Popover,
	TextControl,
	TextareaControl,
	ToggleControl
} from "@wordpress/components";
import { useRef, useState } from "@wordpress/element";
import { link as linkIcon, edit as editIcon } from "@wordpress/icons";

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
};

const DEFAULT_CONTACT_LINK: ContactLink = {
	url: "",
	postId: null,
	postType: null,
	opensInNewTab: true,
	title: "",
	label: ""
};

const TeamMemberPanel = () => {
	const postType = useSelect((select) => select(coreEditorStore).getCurrentPostType(), []);

	const meta: Meta = useSelect(
		(select) => select(coreEditorStore).getEditedPostAttribute("meta") || {},
		[]
	);

	const excerpt: string = useSelect(
		(select) => select(coreEditorStore).getEditedPostAttribute("excerpt") || "",
		[]
	);

	const { editPost } = useDispatch(coreEditorStore);

	const [isLinkOpen, setIsLinkOpen] = useState(false);
	const linkCardRef = useRef<HTMLButtonElement>(null);

	if (postType !== "team_member") {
		return null;
	}

	const updateMeta = (field: string, value: string) => {
		editPost({ meta: { ...meta, [field]: value } });
	};

	const contactLink = { ...DEFAULT_CONTACT_LINK, ...meta.contact_link };

	const updateContactLink = (changes: Partial<ContactLink>) => {
		editPost({
			meta: {
				...meta,
				contact_link: { ...contactLink, ...changes, opensInNewTab: true }
			}
		});
	};

	const hasUrl = !!contactLink.url;

	return (
		<PluginDocumentSettingPanel
			name="team-member-settings"
			title={__("Team Member Settings", "takt")}
		>
			<>
				<TextControl
					label={__("First Name", "takt")}
					value={meta.first_name || ""}
					onChange={(value) => updateMeta("first_name", value)}
					placeholder={__("Enter first name", "takt")}
					__nextHasNoMarginBottom
					__next40pxDefaultSize
				/>
				<TextControl
					label={__("Last Name", "takt")}
					value={meta.last_name || ""}
					onChange={(value) => updateMeta("last_name", value)}
					placeholder={__("Enter last name", "takt")}
					__nextHasNoMarginBottom
					__next40pxDefaultSize
				/>
				<TextControl
					label={__("Job Title", "takt")}
					value={excerpt}
					onChange={(value) => editPost({ excerpt: value })}
					placeholder={__("Enter job title", "takt")}
					__nextHasNoMarginBottom
					__next40pxDefaultSize
				/>
				<TextareaControl
					label={__("Bio", "takt")}
					value={meta.bio || ""}
					onChange={(value) => updateMeta("bio", value)}
					placeholder={__("Enter bio", "takt")}
					rows={4}
					__nextHasNoMarginBottom
				/>
				<ToggleControl
					label={__("Collapse Bio", "takt")}
					help={__("When enabled, the bio will be truncated with a Read More button.", "takt")}
					checked={!!meta.collapse_bio}
					onChange={(value) => editPost({ meta: { ...meta, collapse_bio: value } })}
					__nextHasNoMarginBottom
				/>
				<BaseControl
					id="team-member-contact-link"
					label={__("Contact Link", "takt")}
					__nextHasNoMarginBottom
				>
					<Button
						ref={linkCardRef}
						icon={hasUrl ? editIcon : linkIcon}
						onClick={() => setIsLinkOpen(!isLinkOpen)}
						variant="secondary"
						className="w-full!"
					>
						{hasUrl ? contactLink.title || contactLink.url : __("Add link", "takt")}
					</Button>
					{isLinkOpen && (
						<Popover
							placement="left"
							offset={24}
							anchor={linkCardRef.current}
							onClose={() => setIsLinkOpen(false)}
							focusOnMount
						>
							<div role="dialog" style={{ padding: "8px 0" }}>
								<LinkControl
									settings={[]}
									hasTextControl={false}
									value={contactLink}
									onChange={(value: any) => {
										updateContactLink({
											url: value.url,
											postId: typeof value.id === "number" ? value.id : null,
											postType: typeof value.id === "number" ? value.type : null
										});
									}}
									onRemove={() => {
										updateContactLink({
											url: "",
											postId: null,
											postType: null
										});
										setIsLinkOpen(false);
									}}
								/>
								<TextControl
									label={__("Button Text", "takt")}
									value={contactLink.title || ""}
									onChange={(value) => updateContactLink({ title: value })}
									placeholder={__("Get In Touch", "takt")}
									className="block-editor-link-control__field"
									__nextHasNoMarginBottom
									__next40pxDefaultSize
								/>
							</div>
						</Popover>
					)}
				</BaseControl>
			</>
		</PluginDocumentSettingPanel>
	);
};

registerPlugin("team-member-cpt-panel", {
	render: TeamMemberPanel,
	icon: null
});
