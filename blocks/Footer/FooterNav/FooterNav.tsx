import { __ } from "@wordpress/i18n";
import { useBlockProps, useInnerBlocksProps } from "@wordpress/block-editor";
import { Appender } from "@taktdev/components";

const TEMPLATE: [string, Record<string, unknown>][] = [
	["takt/footer-nav-column", { heading: "About" }],
	["takt/footer-nav-column", { heading: "Health + Dental" }],
	["takt/footer-nav-column", { heading: "Financial Wellbeing + Support" }],
	["takt/footer-nav-column", { heading: "Advocacy + Resources" }],
	["takt/footer-nav-column", { heading: "Social + Community Spaces" }],
	["takt/footer-nav-column", { heading: "Student Voices" }]
];

export default function Edit() {
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8"
		},
		{
			allowedBlocks: ["takt/footer-nav-column"],
			template: TEMPLATE,
			renderAppender: false
		}
	);

	return (
		<nav
			{...useBlockProps({
				className: "py-8 text-white not-discourse"
			})}
			aria-label={__("Footer Navigation", "takt")}
		>
			<div className="relative">
				<Appender />
				<div {...innerBlocksProps} />
			</div>
		</nav>
	);
}
