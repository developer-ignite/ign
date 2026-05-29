/**
 * Scroll-triggered entrance animations.
 *
 * Watches all [data-animate] elements via IntersectionObserver.
 * Adds `is-visible` class when 15 % of the element enters the viewport.
 * Each element animates once (unobserved after trigger).
 *
 * Stagger support: a parent with [data-animate-stagger] computes
 * transition-delay on each child [data-animate] as index * 100 ms (capped 600 ms).
 *
 * Column stagger: [data-animate-stagger="column"] buckets children by their
 * visual left edge (handles CSS grid / masonry). Column N gets N * 100 ms delay
 * (capped 600 ms). The parent itself becomes the intersection target so all
 * children animate in together when the block enters the viewport.
 *
 * Delay support: [data-animate-delay="150"] applies that value as transition-delay.
 */

document.addEventListener("DOMContentLoaded", () => {
	// Apply stagger delays before observing
	document.querySelectorAll("[data-animate-stagger]").forEach((parent) => {
		const mode = parent.getAttribute("data-animate-stagger");
		const children = parent.querySelectorAll(":scope > [data-animate]");

		if (mode === "column") {
			const lefts = Array.from(children).map((child) =>
				Math.round(child.getBoundingClientRect().left / 10) * 10
			);
			const uniqueLefts = [...new Set(lefts)].sort((a, b) => a - b);
			children.forEach((child, index) => {
				const colIdx = uniqueLefts.indexOf(lefts[index]);
				const delay = Math.min(colIdx * 100, 600);
				child.style.transitionDelay = `${delay}ms`;
			});
			parent.setAttribute("data-animate-group-trigger", "");
		} else {
			children.forEach((child, index) => {
				const delay = Math.min(index * 100, 600);
				child.style.transitionDelay = `${delay}ms`;
			});
		}
	});

	// Apply explicit delays
	document.querySelectorAll("[data-animate-delay]").forEach((el) => {
		const delay = el.getAttribute("data-animate-delay");
		if (delay) {
			el.style.transitionDelay = `${delay}ms`;
		}
	});

	// Default per-element observer (skips children of group-trigger parents).
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("is-visible");
					observer.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0.15 }
	);

	document.querySelectorAll("[data-animate]").forEach((el) => {
		if (el.closest("[data-animate-group-trigger]")) {
			return;
		}
		observer.observe(el);
	});

	// Group-trigger observer: parent intersects -> reveal all child [data-animate] at once.
	document.querySelectorAll("[data-animate-group-trigger]").forEach((parent) => {
		const children = parent.querySelectorAll(":scope > [data-animate]");
		const groupObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						children.forEach((child) => child.classList.add("is-visible"));
						groupObserver.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.15 }
		);
		groupObserver.observe(parent);
	});
});
