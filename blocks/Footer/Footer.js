/**
 * Footer entrance animation.
 *
 * Watches each .footer on the page with IntersectionObserver. Uses a lenient
 * trigger (threshold 0 + positive bottom rootMargin) so the animation fires
 * as soon as any pixel of the footer reaches the viewport, even in edge
 * cases where the footer can't reach a higher threshold (short viewport,
 * large footer, etc.).
 *
 * Once triggered, adds `.is-in-view` which the CSS uses to grow the gradient
 * from the bottom and fade the sections up in sequence. Observes once, then
 * unobserves.
 *
 * Respects prefers-reduced-motion (the class is still added so sections
 * settle into their final state; the CSS skips the animation).
 */

document.addEventListener("DOMContentLoaded", () => {
	const footers = document.querySelectorAll("footer.footer");
	if (!footers.length) return;

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("is-in-view");
					observer.unobserve(entry.target);
				}
			});
		},
		{
			threshold: 0,
			rootMargin: "0px 0px 100px 0px",
		}
	);

	footers.forEach((footer) => observer.observe(footer));
});
