import { __ } from "@wordpress/i18n";
import { useState, useRef, useEffect, useCallback } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	BlockControls,
	store as blockEditorStore
} from "@wordpress/block-editor";
import { PanelBody, SelectControl, ToolbarButton, ToolbarGroup } from "@wordpress/components";
import { cn, renameBlock } from "@taktdev/utilities";
import { Appender, Link } from "@taktdev/components";

import { ReactComponent as ChevronDown } from "../resources/ChevronDown.svg";
import { ReactComponent as SubmenuIcon } from "../resources/SubmenuIcon.svg";

type NavLink = {
	title: string;
	url: string;
	postId?: number | null;
	postType?: string | null;
	opensInNewTab: boolean;
};

type HeaderItemAttributes = {
	anchor?: string;
	link: NavLink;
	submenuAlignment: string;
};

type EditProps = {
	attributes: HeaderItemAttributes;
	setAttributes: (attrs: Partial<HeaderItemAttributes>) => void;
	clientId: string;
};

export default function Edit({ attributes, setAttributes, clientId }: EditProps) {
	const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
	const submenuRef = useRef<HTMLDivElement>(null);
	const itemRef = useRef<HTMLLIElement>(null);

	const getDoc = useCallback(() => itemRef.current?.ownerDocument || document, []);

	const isDesktop = useCallback(() => {
		const win = itemRef.current?.ownerDocument?.defaultView || window;
		return win.matchMedia("(min-width: 60rem)").matches;
	}, []);

	// Listen for close-others events (desktop only: one submenu at a time)
	useEffect(() => {
		const doc = getDoc();
		const handler = (e: Event) => {
			const detail = (e as CustomEvent).detail;
			if (detail.clientId !== clientId) {
				setIsSubmenuOpen(false);
			}
		};
		doc.addEventListener("header-close-other-submenus", handler);
		return () => doc.removeEventListener("header-close-other-submenus", handler);
	}, [clientId, getDoc]);

	// On open/close: dispatch height to Header + close others on desktop
	useEffect(() => {
		const doc = getDoc();

		if (isSubmenuOpen && submenuRef.current) {
			// On desktop, close other submenus first
			if (isDesktop()) {
				doc.dispatchEvent(
					new CustomEvent("header-close-other-submenus", {
						detail: { clientId }
					})
				);
			}

			// Observe submenu height and notify Header
			const el = submenuRef.current;
			const dispatchHeight = () => {
				doc.dispatchEvent(
					new CustomEvent("header-submenu-change", {
						// +24px for the mt-6 gap between nav and submenu
						detail: { clientId, height: el.offsetHeight + 24 }
					})
				);
			};
			const observer = new ResizeObserver(dispatchHeight);
			observer.observe(el);
			dispatchHeight();
			return () => observer.disconnect();
		}

		doc.dispatchEvent(
			new CustomEvent("header-submenu-change", {
				detail: { clientId, height: 0 }
			})
		);
	}, [isSubmenuOpen, clientId, getDoc, isDesktop]);

	const hasInnerBlocks = useSelect(
		(select) => {
			const blocks = (select(blockEditorStore) as any).getBlocks(clientId);
			return blocks.length > 0;
		},
		[clientId]
	);

	const anchor = attributes.anchor || `nav-item-${clientId.slice(0, 8)}`;

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: "flex flex-col md:gap-4 max-md:gap-1 list-none p-0 m-0 max-md:pl-6 max-md:mt-4"
		},
		{
			allowedBlocks: ["takt/header-sub-item"],
			template: [],
			renderAppender: false
		}
	);

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon={SubmenuIcon}
						label={__("Toggle Dropdown Menu", "takt")}
						onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}
						isPressed={isSubmenuOpen || hasInnerBlocks}
					/>
				</ToolbarGroup>
			</BlockControls>

			{hasInnerBlocks && (
				<InspectorControls>
					<PanelBody title={__("Submenu Settings", "takt")} initialOpen={true}>
						<SelectControl
							label={__("Desktop Alignment", "takt")}
							value={attributes.submenuAlignment}
							options={[
								{
									label: __("Left", "takt"),
									value: "left"
								},
								{
									label: __("Right", "takt"),
									value: "right"
								}
							]}
							onChange={(value) =>
								setAttributes({
									submenuAlignment: value
								})
							}
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
					</PanelBody>
				</InspectorControls>
			)}

			<li
				{...useBlockProps({
					ref: itemRef,
					className: "list-none relative header-main-item not-discourse"
				})}
			>
				{/* Link or Button depending on children */}
				{!hasInnerBlocks && (
					<Link
						link={attributes.link}
						onChange={(value) => {
							const newLink = { ...attributes.link, ...value };
							renameBlock(newLink.title, attributes.link.title, clientId);
							setAttributes({ link: newLink });
						}}
						placeholder={__("Nav item…", "takt")}
						validateLink={true}
						className="flex items-center gap-2 cursor-pointer bg-transparent border-0 p-0 font-sans font-medium text-base md:text-sm lg:text-base leading-[1.16] text-white uppercase no-underline! transition-colors hover:text-neon-green max-md:w-full max-md:justify-between focus-visible:text-neon-green focus-visible:outline-dotted focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
					/>
				)}

				{hasInnerBlocks && (
					<div
						className={cn({
							"group header-main-item-button flex items-center gap-2 bg-transparent border-0 p-0 font-sans font-medium text-base md:text-sm lg:text-base leading-[1.16] text-white uppercase no-underline! transition-colors hover:text-neon-green max-md:w-full max-md:justify-between focus-visible:text-neon-green focus-visible:outline-dotted focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2": true,
							"text-accent": isSubmenuOpen
						})}
						aria-expanded={isSubmenuOpen}
						aria-controls={`${anchor}-submenu`}
					>
						<Link
							link={attributes.link}
							onChange={(value) => {
								const newLink = {
									...attributes.link,
									...value
								};
								renameBlock(newLink.title, attributes.link.title, clientId);
								setAttributes({ link: newLink });
							}}
							placeholder={__("Nav item…", "takt")}
							validateLink={true}
							className="font-sans font-medium text-base leading-[1.16] uppercase no-underline! transition-colors text-inherit"
							tagName="span"
						/>
						<button
							type="button"
							onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}
							className={cn({
								"w-3 h-auto transition-transform duration-200 cursor-pointer bg-transparent border-0 p-0 text-inherit": true,
								"rotate-180": isSubmenuOpen
							})}
							aria-label={__("Toggle submenu", "takt")}
						>
							<ChevronDown />
						</button>
					</div>
				)}

				{/* Submenu (single container -- desktop: absolute dropdown, mobile: inline accordion) */}
				{(hasInnerBlocks || isSubmenuOpen) && (
					<div
						ref={submenuRef}
						id={`${anchor}-submenu`}
						style={{ positionTryFallbacks: "flip-inline" }}
						className={cn({
							"header-main-item-submenu text-white md:block md:absolute md:top-full md:mt-6 md:-ml-6 md:bg-charcoal md:rounded-xl md:p-6 md:w-max md:min-w-[calc(100%+3rem)] md:z-[210] max-md:w-full before:md:absolute before:md:bottom-full before:md:left-0 before:md:w-full before:md:h-6 before:md:content-['']":
								isSubmenuOpen,
							hidden: !isSubmenuOpen,
							"md:left-0": attributes.submenuAlignment === "left",
							"md:right-0 md:-mr-6": attributes.submenuAlignment === "right"
						})}
					>
						<div className="relative">
							<Appender />
							<ul {...innerBlocksProps} />
						</div>
					</div>
				)}
			</li>
		</>
	);
}
