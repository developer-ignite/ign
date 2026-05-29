import { addFilter } from "@wordpress/hooks";

/**
 * Strip all inline style attributes from pasted HTML in Gutenberg blocks.
 */
addFilter("blocks.prePasteProcess", "takt/remove-paste-styles", (html) => {
	// Create a DOM parser to process the pasted HTML
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, "text/html");

	// Remove style attributes from all elements
	doc.querySelectorAll("[style]").forEach((el) => {
		el.removeAttribute("style");
	});

	// Return cleaned HTML
	return doc.body.innerHTML;
});
