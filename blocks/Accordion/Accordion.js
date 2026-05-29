/**
 * Accordion - Frontend interactivity
 *
 * Handles:
 * - Smooth open/close animation using CSS grid-template-rows transition
 * - Exclusive mode (only one item open at a time)
 * - Always-one-open behavior
 * - Video playback within accordion items
 *
 * Animation approach:
 * - Opening: Set the `open` attribute; CSS transition handles the rest via
 *   `grid-template-rows: 0fr -> 1fr` on the `.accordion-item-grid` wrapper.
 * - Closing: We cannot simply remove `open` because the browser immediately
 *   hides content, bypassing CSS transitions. Instead we add a `closing` class
 *   that forces `grid-template-rows: 0fr`, wait for the transition to finish,
 *   then actually remove `open`.
 */
document.addEventListener( 'DOMContentLoaded', () => {
	const TRANSITION_DURATION = 300;

	// ---- Animated open/close helpers ----

	/**
	 * Opens a <details> element with animation.
	 */
	function animatedOpen( detail ) {
		// If it's mid-close, cancel that
		detail.classList.remove( 'closing' );
		// Add opening class to hold grid at 0fr while the open attribute is set
		detail.classList.add( 'opening' );
		detail.open = true;
		// Force reflow so the browser computes the 0fr state first
		detail.offsetHeight;
		// Remove opening class — CSS transitions from 0fr to 1fr
		detail.classList.remove( 'opening' );
	}

	/**
	 * Closes a <details> element with animation.
	 * Returns a promise that resolves when the close animation finishes.
	 */
	function animatedClose( detail ) {
		return new Promise( ( resolve ) => {
			if ( ! detail.open ) {
				resolve();
				return;
			}

			// Add closing class to trigger grid-template-rows: 0fr while still open
			detail.classList.add( 'closing' );

			// After the CSS transition completes, actually close the element
			let finished = false;
			const onEnd = () => {
				if ( finished ) return;
				finished = true;
				detail.classList.remove( 'closing' );
				detail.open = false;
				resolve();
			};

			const grid = detail.querySelector( '.accordion-item-grid' );
			if ( grid ) {
				const handler = ( e ) => {
					if ( e.propertyName === 'grid-template-rows' ) {
						grid.removeEventListener( 'transitionend', handler );
						onEnd();
					}
				};
				grid.addEventListener( 'transitionend', handler );

				// Fallback in case transitionend doesn't fire
				setTimeout( onEnd, TRANSITION_DURATION + 50 );
			} else {
				// No grid wrapper found, close immediately
				onEnd();
			}
		} );
	}

	// ---- Video playback ----

	const videoContainers = document.querySelectorAll( '.accordion-video-container' );

	videoContainers.forEach( ( container ) => {
		const playButton = container.querySelector( '.accordion-play-button' );
		const video = container.querySelector( 'video' );
		const embedContainer = container.querySelector( '.embed-video-container' );

		if ( ! playButton ) return;

		playButton.addEventListener( 'click', () => {
			playButton.classList.add( 'hidden' );

			if ( video ) {
				video.play();
				return;
			}

			if ( embedContainer ) {
				const source = embedContainer.dataset.source;
				const videoId = embedContainer.dataset.videoId;

				if ( source === 'youtube' ) {
					embedContainer.innerHTML = '<iframe src="https://www.youtube.com/embed/' + videoId + '?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
				} else if ( source === 'vimeo' ) {
					embedContainer.innerHTML = '<iframe src="https://player.vimeo.com/video/' + videoId + '?autoplay=1&byline=0&portrait=0&badge=0&dnt=true&vimeo_logo=false&title=false" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>';
				}
			}
		} );
	} );

	// ---- Accordion behavior ----

	const accordionContainers = document.querySelectorAll( '[data-exclusive-mode]' );

	accordionContainers.forEach( ( container ) => {
		const exclusiveMode = container.dataset.exclusiveMode === 'true';
		const alwaysOneOpen = container.dataset.alwaysOneOpen === 'true';
		const details = Array.from( container.querySelectorAll( 'details' ) );

		// Auto-open first item if alwaysOneOpen is enabled and no items are open
		if ( alwaysOneOpen && exclusiveMode ) {
			const hasOpenItems = details.some( ( detail ) => detail.open );
			if ( ! hasOpenItems && details.length > 0 ) {
				details[ 0 ].open = true;
			}
		}

		// Intercept summary clicks for animated toggle
		details.forEach( ( detail ) => {
			const summary = detail.querySelector( 'summary' );
			if ( ! summary ) return;

			summary.addEventListener( 'click', ( event ) => {
				// Always prevent default — we handle open/close manually
				event.preventDefault();

				// If closing and this is mid-animation, ignore
				if ( detail.classList.contains( 'closing' ) ) return;

				if ( detail.open ) {
					// Closing this item

					// If alwaysOneOpen in exclusive mode, prevent closing the last open item
					if ( alwaysOneOpen && exclusiveMode ) {
						const hasOpenSiblings = details.some(
							( sibling ) => sibling !== detail && sibling.open && ! sibling.classList.contains( 'closing' )
						);
						if ( ! hasOpenSiblings ) return;
					}

					animatedClose( detail );
				} else {
					// Opening this item

					// In exclusive mode, close siblings first
					if ( exclusiveMode ) {
						details.forEach( ( sibling ) => {
							if ( sibling !== detail && sibling.open ) {
								animatedClose( sibling );
							}
						} );
					}

					animatedOpen( detail );
				}
			} );
		} );
	} );
} );
