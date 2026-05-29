import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay, A11y } from 'swiper/modules';

function getCarouselConfig( opts ) {
	const parent = opts.element.closest( '.swiper-parent' );

	return {
		modules: [ Navigation, Pagination, Autoplay, A11y ],
		watchSlidesProgress: true,
		slidesPerView: 1,
		breakpoints: {
			570: {
				slidesPerView: Math.min( opts.columns ?? 3, 2 ),
			},
			900: {
				slidesPerView: opts.columns ?? 3,
			},
		},
		breakpointsBase: 'container',
		spaceBetween: 24,
		simulateTouch: false,
		watchOverflow: false,
		autoHeight: false,
		navigation: {
			enabled: opts.showNavigation,
			prevEl: parent?.querySelector(
				'.swiper-arrows .prev'
			),
			nextEl: parent?.querySelector(
				'.swiper-arrows .next'
			),
		},
		pagination: {
			enabled: opts.showPagination,
			el: parent?.querySelector( '.swiper-pagination' ),
			type: 'progressbar',
		},
		loop: opts.loopCarousel && ! opts.isEditor,
		autoplay:
			opts.autoplayCarousel && ! opts.isEditor
				? {
					delay: ( opts.autoplayDelay ?? 3 ) * 1000,
					pauseOnMouseEnter: true,
					disableOnInteraction: false,
				}
				: false,
	};
}

/**
 * Update slide ARIA + inert state. Handles loop mode (skips Swiper's
 * duplicate slides for numbering, but still inert-toggles them so the
 * a11y tree stays in sync with what is visible on screen).
 */
function updateSlideAriaAttributes( swiper ) {
	const realSlidesCount = swiper.slides.filter(
		( slide ) => ! slide.classList.contains( 'swiper-slide-duplicate' )
	).length;

	let realIndex = 0;
	swiper.slides.forEach( ( slide ) => {
		const isDuplicate = slide.classList.contains( 'swiper-slide-duplicate' );
		if ( ! isDuplicate ) {
			realIndex += 1;
			slide.setAttribute( 'role', 'group' );
			slide.setAttribute( 'aria-roledescription', 'slide' );
			slide.setAttribute( 'aria-label', `Slide ${ realIndex } of ${ realSlidesCount }` );
		}

		if ( slide.classList.contains( 'swiper-slide-visible' ) ) {
			slide.removeAttribute( 'inert' );
		} else {
			slide.setAttribute( 'inert', '' );
		}
	} );
}

document.addEventListener( 'DOMContentLoaded', () => {
	const prefersReducedMotion = window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;

	document.querySelectorAll( '.cards-carousel-swiper' ).forEach( ( element ) => {
		const parent = element.closest( '.swiper-parent' );
		const wrapper = element.querySelector( '.swiper-wrapper' );
		const autoplayToggle = parent?.querySelector( '.carousel-autoplay-toggle' );

		// Respect prefers-reduced-motion: disable autoplay if user prefers reduced motion
		const autoplayEnabled = element.dataset.autoplay === '1' && ! prefersReducedMotion;

		const swiper = new Swiper( element, getCarouselConfig( {
			element,
			columns: parseInt( element.dataset.columns, 10 ),
			showNavigation: element.dataset.navigation === '1',
			showPagination: element.dataset.pagination === '1',
			loopCarousel: element.dataset.loop === '1',
			autoplayCarousel: autoplayEnabled,
			autoplayDelay: parseFloat( element.dataset.autoplayDelay ),
			isEditor: false,
		} ) );

		// Sync ARIA + inert state with what is visible on screen.
		updateSlideAriaAttributes( swiper );
		swiper.on( 'slideChange', () => updateSlideAriaAttributes( swiper ) );
		swiper.on( 'slideChangeTransitionEnd', () => updateSlideAriaAttributes( swiper ) );

		// Autoplay rotation control and accessibility
		if ( autoplayEnabled && autoplayToggle ) {
			let isPlaying = true;

			// Set initial aria-live state
			if ( wrapper ) {
				wrapper.setAttribute( 'aria-live', 'off' );
			}

			// Store initial icon HTML for toggling
			const pauseIcon = autoplayToggle.innerHTML;
			const playIcon = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M5 3L12 8L5 13V3Z" fill="currentColor"/>
</svg>`;

			// Toggle button click handler
			autoplayToggle.addEventListener( 'click', () => {
				if ( isPlaying ) {
					swiper.autoplay.stop();
					isPlaying = false;
					autoplayToggle.setAttribute( 'aria-label', autoplayToggle.dataset.labelPlay || 'Start slide rotation' );
					autoplayToggle.innerHTML = playIcon;
					if ( wrapper ) {
						wrapper.setAttribute( 'aria-live', 'polite' );
					}
				} else {
					swiper.autoplay.start();
					isPlaying = true;
					autoplayToggle.setAttribute( 'aria-label', autoplayToggle.dataset.labelPause || 'Stop slide rotation' );
					autoplayToggle.innerHTML = pauseIcon;
					if ( wrapper ) {
						wrapper.setAttribute( 'aria-live', 'off' );
					}
				}
			} );

			// Pause on focus, resume on blur (only if was playing)
			if ( parent ) {
				parent.addEventListener( 'focusin', () => {
					if ( isPlaying && swiper.autoplay.running ) {
						swiper.autoplay.pause();
					}
				} );

				parent.addEventListener( 'focusout', ( e ) => {
					// Only resume if focus left the carousel entirely
					if ( isPlaying && ! parent.contains( e.relatedTarget ) ) {
						swiper.autoplay.resume();
					}
				} );
			}
		}
	} );
} );
