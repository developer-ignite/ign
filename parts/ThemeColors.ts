import { __ } from "@wordpress/i18n";

const colors = [
	{
		name: __("Neon Green", "takt"),
		color: "#D4FF45",
		className: "neon-green"
	},
	{ name: __("Blue", "takt"), color: "#47CBF2", className: "blue" },
	{ name: __("Green", "takt"), color: "#78DB6B", className: "green" },
	{ name: __("Yellow", "takt"), color: "#FFD24C", className: "yellow" },
	{ name: __("Orange", "takt"), color: "#FF7614", className: "orange" },
	{ name: __("Purple", "takt"), color: "#B497D8", className: "purple" }
];

export const ColorValue = (value: string) => {
	const { colorOptions, colorClasses } = ThemeColors(colors.map((c) => c.className));

	return (
		colorOptions.find(
			(option) =>
				option.name === colorClasses.find((colorClass) => colorClass.className === value)?.name
		)?.color || value
	);
};

export const ColorClass = (value: string) => {
	const { colorOptions, colorClasses } = ThemeColors(colors.map((c) => c.className));

	const selectedOption = colorOptions.find((option) => option.color === value);

	const selectedClass = colorClasses.find((colorClass) => colorClass.name === selectedOption?.name);

	return selectedClass?.className || value;
};

export const ThemeColors = (selected: string[] = []) => {
	const colorOptions = [];
	const colorClasses = [];

	colors.forEach((color) => {
		if (selected.length === 0 || selected.includes(color.className)) {
			colorOptions.push({ name: color.name, color: color.color });
			colorClasses.push({
				name: color.name,
				className: color.className
			});
		}
	});

	return {
		colorOptions,
		colorClasses
	};
};

export default {
	ThemeColors,
	ColorValue,
	ColorClass
};
