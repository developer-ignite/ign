import { __ } from "@wordpress/i18n";
import { forwardRef } from "@wordpress/element";
import { shouldDisplay, cn } from "@taktdev/utilities";
import { AdvancedRichText } from "@taktdev/components";
import { ThemeButton } from "parts/ThemeButton";

export type HeadingProps = {
	eyebrow?: string;
	heading?: string;
	description?: string;
	buttons?: Array<{
		title?: string;
		url?: string;
		postId?: number;
		opensInNewTab?: boolean;
		label?: string;
	}>;
	className?: string;
	headingSize?: 0 | 1 | 2 | 3;
	headingTag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
	alignment?: "left" | "center" | "right";
	columns?: 1 | 2;
	enableEyebrow?: boolean;
	enableHeading?: boolean;
	enableDescription?: boolean;
	enableButtons?: boolean;
	eyebrowClassName?: string;
	headingClassName?: string;
	descriptionClassName?: string;
	buttonsClassName?: string;
	buttonVariations?: string[];
	eyebrowPlaceholder?: string;
	headingPlaceholder?: string;
	descriptionPlaceholder?: string;
	buttonPlaceholder?: string;
	onChange?: Function;
};

const defaultButtonVariations = ["primary", "secondary", "tertiary"];

export const ThemeHeading = forwardRef<HTMLDivElement, HeadingProps>(
	(
		{
			eyebrow,
			heading,
			description,
			buttons = [{}, {}, {}],
			className = "",
			headingSize = 2,
			headingTag = "h2",
			alignment = "left",
			columns = 1,
			enableEyebrow = true,
			enableHeading = true,
			enableDescription = true,
			enableButtons = true,
			eyebrowClassName = "",
			headingClassName = "",
			descriptionClassName = "",
			buttonsClassName = "",
			buttonVariations = defaultButtonVariations,
			eyebrowPlaceholder = __("Eyebrow", "takt"),
			headingPlaceholder = __("Heading", "takt"),
			descriptionPlaceholder = __("Description", "takt"),
			buttonPlaceholder = __("Button", "takt"),
			onChange,
			...props
		}: HeadingProps,
		externalRef
	) => {
		const { displayContent } = shouldDisplay();

		const hasButtons =
			enableButtons &&
			buttons.some(
				(b) =>
					(b?.url !== "" && b?.url !== undefined) || (b?.postId !== null && b?.postId !== undefined)
			);

		const mergeAttributes = (values: {}) => {
			const merged = {
				...(enableEyebrow && { eyebrow }),
				...(enableHeading && { heading }),
				...(enableDescription && { description }),
				...(enableButtons && { buttons }),
				...values
			};

			if (merged.buttons?.every((button) => Object.keys(button).length === 0)) {
				merged.buttons = undefined;
			}

			return merged;
		};

		return (
			<>
				{(displayContent ||
					(enableEyebrow && eyebrow) ||
					(enableHeading && heading) ||
					(enableDescription && description) ||
					(enableButtons && buttons.some((b) => b?.url !== "" || b?.postId !== null))) && (
					<div
						{...props}
						ref={externalRef}
						className={
							cn({
								"theme-heading grid grid-cols-1 h-fit": true,
								"md:grid-cols-2 gap-x-20": columns === 2,
								"md:items-center": columns === 2 && !hasButtons,
								"text-left text-pretty": alignment === "left",
								"text-center text-balance": alignment === "center",
								"text-right text-pretty": alignment === "right"
							}) +
							" " +
							className
						}
					>
						{((enableEyebrow && (displayContent || eyebrow)) ||
							(enableHeading && (displayContent || heading))) && (
							<div className="group">
								{enableEyebrow && (displayContent || eyebrow) && (
									<AdvancedRichText
										className={
											cn({
												"not-last:mb-4 uppercase text-sm font-medium leading-[1.1]": true,
												"not-group-last:last:mb-4": columns === 1,
												"not-group-last:last:max-md:mb-4": columns === 2
											}) +
											" " +
											eyebrowClassName
										}
										tagName="div"
										value={eyebrow}
										allowedFormats={[]}
										onChange={(value) =>
											onChange(
												mergeAttributes({
													eyebrow: value
												})
											)
										}
										placeholder={eyebrowPlaceholder}
									/>
								)}

								{enableHeading && (displayContent || heading) && (
									<AdvancedRichText
										className={
											cn({
												"not-group-last:mb-8": columns === 1,
												"not-group-last:max-md:mb-8": columns === 2,
												"text-header-0": headingSize === 0,
												"text-header-1": headingSize === 1,
												"text-header-2": headingSize === 2,
												"text-header-3": headingSize === 3
											}) +
											" " +
											headingClassName
										}
										tagName={headingTag}
										value={heading}
										allowedFormats={[]}
										onChange={(value) =>
											onChange(
												mergeAttributes({
													heading: value
												})
											)
										}
										placeholder={headingPlaceholder}
									/>
								)}
							</div>
						)}

						{((enableDescription && (displayContent || description)) ||
							(enableButtons &&
								(displayContent ||
									buttons.some(
										(b) =>
											(b?.url !== "" && b?.url !== undefined) ||
											(b?.postId !== null && b?.postId !== undefined)
									)))) && (
							<div
								className={cn({
									"group flex flex-col": true,
									"md:pt-[calc(0.875rem*1.1+1rem)]":
										columns === 2 && enableEyebrow && (displayContent || !!eyebrow)
								})}
							>
								{enableDescription && (displayContent || description) && (
									<AdvancedRichText
										className={"not-last:mb-8 " + descriptionClassName}
										tagName="p"
										value={description}
										allowedFormats={["core/bold", "core/italic", "core/link"]}
										onChange={(value) =>
											onChange(
												mergeAttributes({
													description: value
												})
											)
										}
										placeholder={descriptionPlaceholder}
									/>
								)}

								{enableButtons &&
									(displayContent ||
										buttons.some(
											(b) =>
												(b?.url !== "" && b?.url !== undefined) ||
												(b?.postId !== null && b?.postId !== undefined)
										)) && (
										<div
											className={
												cn({
													"inline-flex flex-wrap gap-x-4 gap-y-2 items-center first:mt-auto": true,
													"justify-start": alignment === "left",
													"md:first:ml-auto": columns === 2 && alignment === "left",
													"justify-center": alignment === "center",
													"justify-right": alignment === "right"
												}) +
												" " +
												buttonsClassName
											}
										>
											{buttons.map(
												(button, index) =>
													(displayContent ||
														(button?.url !== "" && button?.url !== undefined) ||
														(button?.postId !== null && button?.postId !== undefined)) && (
														<ThemeButton
															key={index}
															link={button as any}
															onChange={(value) =>
																onChange(
																	mergeAttributes({
																		buttons: buttons.map((item, i) => (i === index ? value : item))
																	})
																)
															}
															variation={buttonVariations[index % buttonVariations.length] as any}
															validateLink={true}
															placeholder={buttonPlaceholder}
														/>
													)
											)}
										</div>
									)}
							</div>
						)}
					</div>
				)}
			</>
		);
	}
);

export default ThemeHeading;
