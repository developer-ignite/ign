/**
 * Team Member Bio - Collapsible toggle
 * Uses event delegation and MutationObserver for dynamically added elements.
 */

function initCollapsible(container) {
	const content = container.querySelector(".team-member-bio-content");
	const toggle = container.querySelector(".team-member-bio-toggle");

	if (!content || !toggle) return;
	if (container.dataset.bioInit === "true") return;
	container.dataset.bioInit = "true";

	// Only show toggle if content overflows the max-height
	if (content.scrollHeight > content.offsetHeight) {
		toggle.classList.remove("hidden");
	}
}

function initAll() {
	document.querySelectorAll(".team-member-bio-collapsible").forEach(initCollapsible);
}

// Event delegation for toggle clicks
document.addEventListener("click", (e) => {
	const toggle = e.target.closest(".team-member-bio-toggle");
	if (!toggle) return;

	const container = toggle.closest(".team-member-bio-collapsible");
	if (!container) return;

	const content = container.querySelector(".team-member-bio-content");
	if (!content) return;

	const moreLabel = toggle.querySelector(".team-member-bio-toggle-more");
	const lessLabel = toggle.querySelector(".team-member-bio-toggle-less");
	const isCollapsed = container.dataset.collapsed === "true";

	if (isCollapsed) {
		content.style.maxHeight = content.scrollHeight + "px";
		container.dataset.collapsed = "false";
		if (moreLabel) moreLabel.classList.add("hidden");
		if (lessLabel) lessLabel.classList.remove("hidden");
	} else {
		content.style.maxHeight = "";
		container.dataset.collapsed = "true";
		if (moreLabel) moreLabel.classList.remove("hidden");
		if (lessLabel) lessLabel.classList.add("hidden");
	}
});

// Init on page load
initAll();

// Observe DOM for dynamically added elements (AJAX, Swiper, etc.)
new MutationObserver((mutations) => {
	for (const mutation of mutations) {
		for (const node of mutation.addedNodes) {
			if (node.nodeType !== 1) continue;
			if (node.matches(".team-member-bio-collapsible")) {
				initCollapsible(node);
			}
			node.querySelectorAll?.(".team-member-bio-collapsible").forEach(initCollapsible);
		}
	}
}).observe(document.body, { childList: true, subtree: true });
