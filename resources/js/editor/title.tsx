import { registerPlugin } from "@wordpress/plugins";
import { PluginPostStatusInfo } from "@wordpress/editor";
import { useSelect, useDispatch } from "@wordpress/data";
import {
	Button,
	Popover,
	__experimentalVStack as VStack,
	__experimentalHStack as HStack,
	__experimentalHeading as Heading,
	__experimentalInputControl as InputControl
} from "@wordpress/components";
import { useState, useRef, useEffect, useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { closeSmall } from "@wordpress/icons";

const TitleSummaryField = () => {
	const [isEditing, setIsEditing] = useState(false);
	const rowRef = useRef<Element>(null);

	const title = useSelect(
		(select) =>
			(
				select("core/editor") as {
					getEditedPostAttribute: (attr: string) => string;
				}
			).getEditedPostAttribute("title"),
		[]
	);

	const { editPost } = useDispatch("core/editor");

	const postTitleDescriptionId = "editor-post-title__description";

	const onChangeTitle = useCallback(
		(newValue?: string) => {
			editPost({ title: newValue ?? "" });
		},
		[editPost]
	);

	const originalTitleRef = useRef(title);
	useEffect(() => {
		if (title && originalTitleRef.current === undefined) {
			originalTitleRef.current = title;
		}
	}, [title]);

	return (
		<PluginPostStatusInfo className="post-title-panel">
			<HStack
				ref={rowRef}
				className="editor-post-panel__row"
				justify="space-between"
				style={{ alignItems: "center" }}
			>
				<div className="editor-post-panel__row-label">{__("Title", "takt")}</div>
				<div className="editor-post-panel__row-control">
					<div className="components-dropdown" tabIndex={-1}>
						<Button
							className="components-button is-compact is-tertiary"
							onClick={() => setIsEditing(true)}
							aria-expanded={isEditing}
							aria-label={__("Change title: ", "takt") + title}
							variant="tertiary"
						>
							{title || "—"}
						</Button>
					</div>
				</div>
			</HStack>

			{isEditing && (
				<Popover
					anchorRef={rowRef}
					offset={36}
					onClose={() => setIsEditing(false)}
					focusOnMount
					placement="left-start"
					className="components-popover components-popover__content components-dropdown__content editor-post-url__panel-dialog is-positioned"
					style={{ maxHeight: "640px", overflow: "auto" }}
				>
					<VStack spacing={4} className="editor-post-url">
						<HStack
							className="block-editor-inspector-popover-header"
							justify="space-between"
							style={{ alignItems: "center", marginBottom: 0 }}
						>
							<Heading
								level={2}
								className="block-editor-inspector-popover-header__heading"
								style={{
									fontSize: "0.8125rem"
								}}
							>
								{__("Title", "takt")}
							</Heading>
							<Button
								icon={closeSmall}
								label={__("Close", "takt")}
								className="block-editor-inspector-popover-header__action is-small has-icon"
								onClick={() => setIsEditing(false)}
							/>
						</HStack>

						<InputControl
							__next40pxDefaultSize
							label={__("Title", "takt")}
							hideLabelFromVision
							value={title || ""}
							autoComplete="off"
							spellCheck="false"
							type="text"
							onChange={(newValue?: string) => onChangeTitle(newValue)}
							onBlur={() => {
								if (!title) {
									onChangeTitle(originalTitleRef.current);
								}
							}}
							aria-describedby={postTitleDescriptionId}
						/>
					</VStack>
				</Popover>
			)}
		</PluginPostStatusInfo>
	);
};

registerPlugin("takt-title-field", {
	render: TitleSummaryField,
	icon: null
});
