import { __ } from "@wordpress/i18n";
import { useBlockProps } from "@wordpress/block-editor";
import { Link } from "@taktdev/components";
import { renameBlock } from "@taktdev/utilities";

type LegalLink = {
	url: string;
	postId?: number;
	postType?: string;
	opensInNewTab: boolean;
	title: string;
	label: string;
};

type FooterCreditsItemAttributes = {
	anchor?: string;
	link: LegalLink;
};

type EditProps = {
	attributes: FooterCreditsItemAttributes;
	setAttributes: (attrs: Partial<FooterCreditsItemAttributes>) => void;
	clientId: string;
};

export default function Edit({ attributes, setAttributes, clientId }: EditProps) {
	return (
		<li {...useBlockProps({ className: "not-discourse" })}>
			<Link
				className="text-xs font-medium leading-normal font-sans underline hover:no-underline! hover:text-neon-green text-white transition-colors"
				titleClassName="w-full"
				link={attributes.link}
				onChange={(value) => {
					const newLink = { ...attributes.link, ...value };
					renameBlock(newLink.title, attributes.link.title, clientId);
					setAttributes({ link: newLink });
				}}
				placeholder={__("Legal link…", "takt")}
				validateLink={true}
			/>
		</li>
	);
}
