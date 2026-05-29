import { registerBlockType, getBlockType } from "@wordpress/blocks";

const stubs = [
	{ name: "tec/single-event", title: "Single Event (TEC)" },
	{ name: "tec/archive-events", title: "Events Archive (TEC)" },
];

for (const { name, title } of stubs) {
	if (getBlockType(name)) continue;

	registerBlockType(name, {
		title,
		category: "widgets",
		apiVersion: 3,
		supports: { html: false, inserter: false },
		edit: () => null,
		save: () => null,
	});
}
