import { __ } from "@wordpress/i18n";
import { useBlockProps, useInnerBlocksProps } from "@wordpress/block-editor";
import { Appender } from "@taktdev/components";

export default function Edit() {
	return (
		<nav
			{...useBlockProps({
				className: "relative not-discourse"
			})}
			aria-label={__("Social Media Links", "takt")}
		>
			<Appender />
			<ul
				{...useInnerBlocksProps(
					{
						className: "flex gap-3 items-center"
					},
					{
						allowedBlocks: ["takt/footer-info-social-item"],
						template: [["takt/footer-info-social-item", {}]],
						renderAppender: false,
						orientation: "horizontal"
					}
				)}
			/>
		</nav>
	);
}
