import { __ } from "@wordpress/i18n";
import { useBlockProps } from "@wordpress/block-editor";
import { Link } from "@taktdev/components";
import { renameBlock } from "@taktdev/utilities";

type NavLink = {
	url: string;
	postId?: number;
	postType?: string;
	opensInNewTab: boolean;
	title: string;
	label: string;
};

type FooterNavColumnItemAttributes = {
	anchor?: string;
	link: NavLink;
};

type EditProps = {
	attributes: FooterNavColumnItemAttributes;
	setAttributes: (attrs: Partial<FooterNavColumnItemAttributes>) => void;
	clientId: string;
};

export default function Edit({ attributes, setAttributes, clientId }: EditProps) {
	return (
		<li {...useBlockProps({ className: "text-xs leading-normal not-discourse" })}>
			<Link
				className="text-xs font-medium leading-normal font-sans no-underline! hover:underline! hover:text-neon-green text-white transition-colors"
				titleClassName="w-full"
				link={attributes.link}
				onChange={(value) => {
					const newLink = { ...attributes.link, ...value };
					renameBlock(newLink.title, attributes.link.title, clientId);
					setAttributes({ link: newLink });
				}}
				placeholder={__("Link title…", "takt")}
				validateLink={true}
			/>
		</li>
	);
}
