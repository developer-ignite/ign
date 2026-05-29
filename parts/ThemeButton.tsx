import { __ } from "@wordpress/i18n";
import { forwardRef, type Element } from "@wordpress/element";
import { Button } from "@taktdev/components";
import type { ButtonVariationTypes } from "@taktdev/components";
import { cn } from "@taktdev/utilities";
import { ReactComponent as TertiaryArrow } from "resources/images/tertiary-arrow.svg";

export type ButtonProps = {
	children?: string;
	link?: {
		title: string;
		url: string;
		postId?: number;
		opensInNewTab?: boolean;
		label?: string;
	};
	className?: string;
	onChange?: (value: {
		title?: string;
		url?: string;
		opensInNewTab?: boolean;
		label?: string;
		variation?: ButtonVariationTypes;
	}) => void;
	placeholder?: string;
	anchor?: string;
	focusOnMount?: string | boolean;
	variation?: ButtonVariationTypes;
	allowVariationChange?: boolean;
	validateLink?: boolean;
	before?: Element;
	after?: Element;
};

export const ThemeButton = forwardRef<HTMLAnchorElement, ButtonProps>(
	(
		{
			link = {
				title: "",
				url: "",
				postId: null,
				opensInNewTab: false,
				label: ""
			},
			className = "",
			onChange = () => {},
			placeholder = __("Button", "takt"),
			variation = "primary",
			allowVariationChange = true,
			validateLink = false,
			...props
		}: ButtonProps,
		externalRef
	) => {
		const isValid = !!(link.url && link.title);
		const isEmpty = !link.title && !link.url && !link.postId;

		// Tertiary buttons get the arrow by default unless `after` is explicitly provided
		const after =
			variation === "tertiary" && !props.after ? (
				<span
					className={cn({
						"btn-tertiary-arrow w-5 h-4 *:w-full *:h-full": true,
						"opacity-[0.62]": isEmpty
					})}
				>
					<TertiaryArrow />
				</span>
			) : (
				props.after
			);

		return (
			<Button
				{...props}
				ref={externalRef}
				mergeRef={false}
				link={link}
				after={after}
				className={cn({
					"btn-primary": variation === "primary",
					"btn-secondary": variation === "secondary",
					"btn-tertiary": variation === "tertiary",
					"*:opacity-[0.62]": !isValid && link.title !== "",
					[className]: !!className
				})}
				onChange={onChange}
				placeholder={placeholder}
				variation={variation}
				allowVariationChange={allowVariationChange}
				validateLink={validateLink}
			/>
		);
	}
);

export default ThemeButton;
