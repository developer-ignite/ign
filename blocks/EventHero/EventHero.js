/**
 * EventHero - Cap .top-gradient max-height to the nearest <main> element height.
 * Scoped to .event-hero wrappers only. Uses ResizeObserver to update dynamically
 * as <main> height changes.
 */
document.addEventListener("DOMContentLoaded", function () {
	document.querySelectorAll(".event-hero .top-gradient").forEach(function (gradient) {
		var main = gradient.closest("main") || document.querySelector("main");
		if (!main) return;
		function updateMaxHeight() {
			gradient.style.maxHeight = main.offsetHeight + "px";
		}
		updateMaxHeight();
		new ResizeObserver(updateMaxHeight).observe(main);
	});
});
