import { __ } from "@wordpress/i18n";
import { useBlockProps } from "@wordpress/block-editor";
import { renameBlock } from "@taktdev/utilities";
import { Link } from "@taktdev/components";

type NavLink = {
	title: string;
	url: string;
	postId?: number | null;
	postType?: string | null;
	opensInNewTab: boolean;
};

type HeaderSubItemAttributes = {
	anchor?: string;
	link: NavLink;
};

type EditProps = {
	attributes: HeaderSubItemAttributes;
	setAttributes: (attrs: Partial<HeaderSubItemAttributes>) => void;
	clientId: string;
};

export default function Edit({ attributes, setAttributes, clientId }: EditProps) {
	return (
		<li
			{...useBlockProps({
				className: "list-none not-discourse"
			})}
		>
			<Link
				link={attributes.link}
				onChange={(value) => {
					const newLink = { ...attributes.link, ...value };
					renameBlock(newLink.title, attributes.link.title, clientId);
					setAttributes({ link: newLink });
				}}
				placeholder={__("Sub item…", "takt")}
				validateLink={true}
				className="py-2 font-sans font-medium text-base leading-[1.16] text-white uppercase no-underline! hover:text-neon-green transition-colors block whitespace-nowrap focus-visible:text-neon-green focus-visible:outline-dotted focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
			/>
		</li>
	);
}
