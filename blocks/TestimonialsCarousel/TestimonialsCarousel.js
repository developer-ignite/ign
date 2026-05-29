import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay, A11y } from 'swiper/modules';

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

	// --- Swiper Initialization ---
	document.querySelectorAll( '.testimonials-carousel-swiper' ).forEach( ( element ) => {
		const parent = element.closest( '.swiper-parent' );
		const wrapper = element.querySelector( '.swiper-wrapper' );
		const autoplayToggle = parent?.querySelector( '.carousel-autoplay-toggle' );

		// Respect prefers-reduced-motion: disable autoplay if user prefers reduced motion
		const autoplayEnabled = element.dataset.autoplay === '1' && ! prefersReducedMotion;

		const swiper = new Swiper( element, {
			modules: [ Navigation, Pagination, Autoplay, A11y ],
			watchSlidesProgress: true,
			slidesPerView: 1,
			breakpoints: {
				570: {
					slidesPerView: 2,
				},
				900: {
					slidesPerView: 3,
				},
			},
			breakpointsBase: 'container',
			spaceBetween: 24,
			simulateTouch: false,
			watchOverflow: false,
			autoHeight: false,
			navigation: {
				enabled: element.dataset.navigation === '1',
				prevEl: parent?.querySelector( '.swiper-arrows .prev' ),
				nextEl: parent?.querySelector( '.swiper-arrows .next' ),
			},
			pagination: {
				enabled: element.dataset.pagination === '1',
				el: parent?.querySelector( '.swiper-pagination' ),
				type: 'progressbar',
			},
			loop: element.dataset.loop === '1',
			autoplay: autoplayEnabled
				? {
					delay: parseFloat( element.dataset.autoplayDelay ) * 1000,
					pauseOnMouseEnter: true,
					disableOnInteraction: false,
				}
				: false,
			a11y: {
				enabled: false,
			},
		} );

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

		// Sync ARIA + inert state with what is visible on screen.
		updateSlideAriaAttributes( swiper );
		swiper.on( 'slideChange', () => updateSlideAriaAttributes( swiper ) );
		swiper.on( 'slideChangeTransitionEnd', () => updateSlideAriaAttributes( swiper ) );
	} );

	// --- Video Modal (Per-Section) ---
	let currentModal = null;
	let lastFocusedElement = null;

	function openModal( modal, videoSource, videoUrl, testimonialName ) {
		if ( ! modal ) {
			return;
		}

		const videoContainer = modal.querySelector( '.testimonial-video-container' );
		const closeBtn = modal.querySelector( '.testimonial-video-close' );

		if ( ! videoContainer ) {
			return;
		}

		currentModal = modal;
		lastFocusedElement = document.activeElement;

		// Update heading text and set ARIA attributes
		const heading = modal.querySelector( '#testimonial-video-heading' );
		if ( heading ) {
			heading.textContent = testimonialName ? `Video - ${ testimonialName }` : 'Video';
		}
		modal.setAttribute( 'aria-hidden', 'false' );
		modal.removeAttribute( 'inert' );

		// Build video content using DOM API (avoid innerHTML with user-sourced URLs)
		videoContainer.textContent = '';
		if ( videoSource === 'file' ) {
			const video = document.createElement( 'video' );
			video.className = 'w-full h-full object-contain';
			video.controls = true;
			video.autoplay = true;
			const source = document.createElement( 'source' );
			source.src = videoUrl;
			source.type = 'video/mp4';
			video.appendChild( source );
			videoContainer.appendChild( video );
		} else {
			const iframe = document.createElement( 'iframe' );
			iframe.className = 'w-full h-full';
			iframe.src = videoUrl;
			iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
			iframe.allowFullscreen = true;
			iframe.setAttribute( 'frameborder', '0' );
			videoContainer.appendChild( iframe );
		}

		// Show modal
		modal.classList.remove( 'opacity-0', 'pointer-events-none' );
		modal.classList.add( 'opacity-100' );
		const modalContent = modal.querySelector( '.testimonial-modal-content' );
		modalContent?.classList.remove( 'scale-95' );
		modalContent?.classList.add( 'scale-100' );

		// Lock body scroll
		document.body.style.overflow = 'hidden';

		// Focus the close button
		requestAnimationFrame( () => {
			closeBtn?.focus();
		} );
	}

	function closeModal() {
		if ( ! currentModal ) {
			return;
		}

		const videoContainer = currentModal.querySelector( '.testimonial-video-container' );
		const modalContent = currentModal.querySelector( '.testimonial-modal-content' );

		// Hide modal
		currentModal.classList.remove( 'opacity-100' );
		currentModal.classList.add( 'opacity-0', 'pointer-events-none' );
		modalContent?.classList.remove( 'scale-100' );
		modalContent?.classList.add( 'scale-95' );
		currentModal.setAttribute( 'aria-hidden', 'true' );
		currentModal.setAttribute( 'inert', '' );

		// Clear video after transition
		setTimeout( () => {
			if ( videoContainer ) {
				videoContainer.textContent = '';
			}
		}, 300 );

		// Unlock body scroll
		document.body.style.overflow = '';

		// Return focus
		if ( lastFocusedElement ) {
			lastFocusedElement.focus();
			lastFocusedElement = null;
		}

		currentModal = null;
	}

	// Video button clicks
	document.querySelectorAll( '.testimonial-video-btn' ).forEach( ( btn ) => {
		btn.addEventListener( 'click', () => {
			const section = btn.closest( 'section.testimonials-carousel' );
			const modal = section?.querySelector( '.testimonial-video-modal' );
			const videoSource = btn.dataset.videoSource;
			const videoUrl = btn.dataset.videoUrl;
			const testimonialName = btn.dataset.testimonialName;
			openModal( modal, videoSource, videoUrl, testimonialName );
		} );
	} );

	// Close button (event delegation)
	document.addEventListener( 'click', ( e ) => {
		if ( e.target.closest( '.testimonial-video-close' ) ) {
			closeModal();
		}
	} );

	// Click outside video to close
	document.addEventListener( 'click', ( e ) => {
		if ( currentModal && e.target === currentModal ) {
			closeModal();
		}
	} );

	// Escape key to close
	document.addEventListener( 'keydown', ( e ) => {
		if ( e.key === 'Escape' && currentModal !== null ) {
			closeModal();
		}
	} );

	// Focus trap
	document.addEventListener( 'keydown', ( e ) => {
		if ( e.key !== 'Tab' || ! currentModal ) {
			return;
		}

		const focusableElements = currentModal.querySelectorAll(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), iframe, video'
		);
		const firstFocusable = focusableElements[ 0 ];
		const lastFocusable = focusableElements[ focusableElements.length - 1 ];

		if ( e.shiftKey ) {
			if ( document.activeElement === firstFocusable ) {
				e.preventDefault();
				lastFocusable.focus();
			}
		} else {
			if ( document.activeElement === lastFocusable ) {
				e.preventDefault();
				firstFocusable.focus();
			}
		}
	} );
} );
