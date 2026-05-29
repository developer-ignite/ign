document.addEventListener("click", (e) => {
	const anchor = e.target.closest("a");
	if (!anchor || !anchor.hash) return;

	if (anchor.hash === "#open-chat") {
		e.preventDefault();
		e.stopPropagation();

		if (window.fcWidget) {
			window.fcWidget.open();
		}
	}
});

if (window.location.hash === "#open-chat") {
	const tryOpen = () => {
		if (window.fcWidget) {
			window.fcWidget.open();
		} else {
			setTimeout(tryOpen, 500);
		}
	};
	tryOpen();
}
