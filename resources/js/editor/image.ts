import { unregisterBlockStyle } from "@wordpress/blocks";
import domReady from "@wordpress/dom-ready";

domReady(() => {
	unregisterBlockStyle("core/image", "default");
	unregisterBlockStyle("core/image", "rounded");
});
