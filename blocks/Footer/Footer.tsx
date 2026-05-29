import { useEffect } from "@wordpress/element";
import { useSelect, useDispatch } from "@wordpress/data";
import { createBlock } from "@wordpress/blocks";
import {
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore
} from "@wordpress/block-editor";

type FooterAttributes = {
	anchor?: string;
};

type EditProps = {
	attributes: FooterAttributes;
	setAttributes: (attrs: Partial<FooterAttributes>) => void;
	clientId: string;
};

const TEMPLATE: [string, Record<string, unknown>][] = [
	["takt/footer-info", {}],
	["takt/footer-nav", {}],
	["takt/footer-credits", {}]
];

const REQUIRED: [string, Record<string, unknown>][] = [
	["takt/footer-info", {}],
	["takt/footer-nav", {}],
	["takt/footer-credits", {}]
];

export default function Edit({ clientId }: EditProps) {
	const { replaceInnerBlocks } = useDispatch(blockEditorStore);

	// Only track direct children's names and clientIds to avoid rerunning on nested changes
	const { directChildren, directChildrenKey } = useSelect(
		(select) => {
			const blocks = select(blockEditorStore).getBlocks(clientId);
			const key = blocks.map((b) => `${b.name}:${b.clientId}`).join(",");
			return { directChildren: blocks, directChildrenKey: key };
		},
		[clientId]
	);

	useEffect(() => {
		const templateBlockNames = TEMPLATE.map(([name]) => name);
		const requiredBlockNames = REQUIRED.map(([name]) => name);

		const reordered: any[] = [];
		let needsUpdate = false;

		for (const [name, attributes = {}] of TEMPLATE) {
			const existing = directChildren.find((block) => block.name === name);
			if (existing) {
				reordered.push(existing);
			} else if (requiredBlockNames.includes(name) || directChildren.length === 0) {
				const newBlock = createBlock(name, attributes);
				reordered.push(newBlock);
				needsUpdate = true;
			}
		}

		const filtered = directChildren.filter((block) => templateBlockNames.includes(block.name));

		const isSameOrder =
			reordered.length === filtered.length &&
			reordered.every((block, i) => block.clientId === filtered[i]?.clientId);

		if (!isSameOrder || needsUpdate) {
			replaceInnerBlocks(clientId, reordered, false);
		}
		// Use directChildrenKey as the dependency instead of directChildren (object reference).
		// This ensures the effect only runs when direct children are added, removed, or reordered,
		// not on every deeply-nested block change (e.g. editing a FooterInfoSocialItem).
		// directChildren is always in sync with directChildrenKey (same selector call).
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [directChildrenKey, clientId, replaceInnerBlocks]);

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: "footer-inner flex flex-col items-stretch relative z-1"
		},
		{
			template: TEMPLATE,
			allowedBlocks: TEMPLATE.map(([name]) => name),
			renderAppender: false
		}
	);

	return (
		<footer
			{...useBlockProps({
				className: "footer relative overflow-hidden py-4 md:py-8 not-discourse"
			})}
		>
			<style>{`
				.footer-inner > [data-type="takt/footer-info"] {
					margin-bottom: 16px;
				}
				.footer-inner > [data-type="takt/footer-nav"],
				.footer-inner > [data-type="takt/footer-credits"] {
					position: relative;
				}
				.footer-inner > [data-type="takt/footer-nav"]::before,
				.footer-inner > [data-type="takt/footer-credits"]::before {
					content: '';
					position: absolute;
					inset: 0;
					left: calc(-1 * var(--side-gutter) / 2);
					right: calc(-1 * var(--side-gutter) / 2);
					background: var(--color-charcoal);
					z-index: -1;
				}
				.footer-inner > [data-type="takt/footer-nav"]:first-of-type::before,
				.footer-inner > [data-type="takt/footer-info"] + [data-type="takt/footer-credits"]::before {
					border-top-left-radius: 32px;
					border-top-right-radius: 32px;
				}
				.footer-inner > [data-type="takt/footer-credits"]:last-child::before {
					border-bottom-left-radius: 32px;
					border-bottom-right-radius: 32px;
				}
				.footer-inner > [data-type="takt/footer-nav"]:last-child::before {
					border-radius: 32px;
				}
				@media (min-width: 768px) {
					.footer-inner > [data-type="takt/footer-nav"]::before,
					.footer-inner > [data-type="takt/footer-credits"]::before {
						left: calc(-1 * var(--bg-extend));
						right: calc(-1 * var(--bg-extend));
					}
				}
			`}</style>
			<div className="container">
				<div {...innerBlocksProps} />
			</div>
		</footer>
	);
}
