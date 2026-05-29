import { __ } from "@wordpress/i18n";
import { useBlockProps, InspectorControls } from "@wordpress/block-editor";
import { PanelBody, ColorPalette } from "@wordpress/components";
import { ThemeColors, ColorValue, ColorClass } from "../../../parts/ThemeColors";
import { cn, renameBlock } from "@taktdev/utilities";
import { Link } from "@taktdev/components";
import { ReactComponent as IconArrow } from "./resources/IconArrow.svg";

type QuickLinkItemAttributes = {
	title?: string;
	url?: string;
	postId?: number;
	opensInNewTab?: boolean;
	accentColor?: string;
};

type EditProps = {
	attributes: QuickLinkItemAttributes;
	setAttributes: (attrs: Partial<QuickLinkItemAttributes>) => void;
	clientId: string;
};

export default function Edit({ attributes, setAttributes, clientId }: EditProps) {
	return (
		<>
			<InspectorControls>
				<PanelBody title={__("Settings", "takt")}>
					<ColorPalette
						colors={ThemeColors().colorOptions}
						value={attributes.accentColor ? ColorValue(attributes.accentColor) : undefined}
						onChange={(color) => {
							setAttributes({ accentColor: color ? ColorClass(color) : "" });
						}}
						disableCustomColors={true}
						clearable={true}
					/>
				</PanelBody>
			</InspectorControls>

			<li
				{...useBlockProps({
					className: cn({
						"not-discourse": true,
						"quick-link-item group border border-charcoal rounded-3xl py-5 px-6 flex gap-4 items-center transition-all": true,
						"hover:bg-accent focus:bg-accent": true,
						[attributes.accentColor]: !!attributes.accentColor
					})
				})}
			>
				<Link
					className="font-heading text-xl flex-1 no-underline!"
					link={{
						title: attributes.title || "",
						url: attributes.url || "",
						postId: attributes.postId,
						opensInNewTab: attributes.opensInNewTab
					}}
					onChange={(value) => {
						renameBlock(value.title, attributes.title, clientId);
						setAttributes({
							title: value.title,
							url: value.url,
							postId: value.postId,
							opensInNewTab: value.opensInNewTab
						});
					}}
					placeholder={__("Link title…", "takt")}
				/>
				<span className="shrink-0 text-charcoal">
					<IconArrow />
				</span>
			</li>
		</>
	);
}
