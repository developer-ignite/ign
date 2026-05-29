import apiFetch from "@wordpress/api-fetch";

const DYNAMIC_LINKS = [
	{
		id: "open-chat",
		title: "Open Chat Widget",
		url: "#open-chat",
		type: "Action",
		subtype: ""
	}
];

apiFetch.use((options, next) => {
	const path = options.path || "";

	if (typeof path === "string" && path.startsWith("/wp/v2/search")) {
		const q = new URLSearchParams(path.split("?")[1]);
		const search = (q.get("search") || "").toLowerCase();
		const type = q.get("type");

		if (type !== "post") {
			return next(options);
		}

		return next(options).then((res) => {
			const extra = DYNAMIC_LINKS.filter((i) => !search || i.title.toLowerCase().includes(search));

			const byUrl = new Map(res.map((r) => [r.url || r.id, r]));
			for (const e of extra) {
				if (!byUrl.has(e.url)) {
					byUrl.set(e.url, e);
				}
			}
			return Array.from(byUrl.values());
		});
	}

	return next(options);
});
