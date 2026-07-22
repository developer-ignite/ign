import { __ } from "@wordpress/i18n";
import { useEffect, useRef } from "@wordpress/element";
import { useBlockProps } from "@wordpress/block-editor";
import {
	shouldDisplay,
	cn,
	renameBlock,
	isTemplatePreview,
	isTemplateEdit
} from "@taktdev/utilities";
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { store as editorStore } from "@wordpress/editor";

type EventCategoryTerm = {
	id: number;
	name: string;
	taxonomy: string;
};

type EditProps = {
	clientId: string;
};

function buildIsoDatetime(
	startDate: string | null,
	endDate: string | null,
	allDay: boolean
): string {
	if (!startDate) {
		return "";
	}
	const start = new Date(startDate);
	const pad = (n: number) => String(n).padStart(2, "0");
	const toDateStr = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
	const toDateTimeStr = (d: Date) => `${toDateStr(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}`;

	if (allDay) {
		const startStr = toDateStr(start);
		if (!endDate) {
			return startStr;
		}
		const end = new Date(endDate);
		const endStr = toDateStr(end);
		return startStr === endStr ? startStr : `${startStr}/${endStr}`;
	}

	const startStr = toDateTimeStr(start);
	if (!endDate) {
		return startStr;
	}
	const end = new Date(endDate);
	return `${startStr}/${toDateTimeStr(end)}`;
}

function formatEventDateRange(
	startDate: string | null,
	endDate: string | null,
	allDay: boolean
): string {
	if (!startDate) {
		return __("Event Date", "takt");
	}

	const start = new Date(startDate);
	const end = endDate ? new Date(endDate) : null;

	const dateOptions: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "long",
		day: "numeric"
	};
	const timeOptions: Intl.DateTimeFormatOptions = {
		hour: "numeric",
		minute: "2-digit"
	};

	const startDateStr = start.toLocaleDateString("en-US", dateOptions);

	if (allDay) {
		if (!end) {
			return startDateStr;
		}
		const startDay = start.toDateString();
		const endDay = end.toDateString();
		if (startDay === endDay) {
			return startDateStr;
		}
		const endDateStr = end.toLocaleDateString("en-US", dateOptions);
		return `${startDateStr} – ${endDateStr}`;
	}

	const startTimeStr = start.toLocaleTimeString("en-US", timeOptions);

	if (!end) {
		return `${startDateStr} | ${startTimeStr}`;
	}

	const startDay = start.toDateString();
	const endDay = end.toDateString();

	if (startDay === endDay) {
		const endTimeStr = end.toLocaleTimeString("en-US", timeOptions);
		return `${startDateStr} | ${startTimeStr} – ${endTimeStr}`;
	}

	const endDateStr = end.toLocaleDateString("en-US", dateOptions);
	const endTimeStr = end.toLocaleTimeString("en-US", timeOptions);
	return `${startDateStr}, ${startTimeStr} – ${endDateStr}, ${endTimeStr}`;
}

export default function Edit({ clientId }: EditProps) {
	const { displayContent } = shouldDisplay();
	const hasHeader = isTemplatePreview() || isTemplateEdit();

	// Fetch current post data (tribe_events post type)
	const post = useSelect((select) => {
		// @ts-ignore
		const currentPostId = select(editorStore).getCurrentPostId();
		// @ts-ignore
		return select(coreStore).getEntityRecord("postType", "tribe_events", currentPostId, {
			_embed: true
		});
	}, []);

	// Extract event data
	const eventTitle = post?.title?.rendered || __("Event Title", "takt");
	const featuredMediaUrl = post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;

	// tribe_events_cat terms come from wp:term embedded data
	const allTermGroups: EventCategoryTerm[][] = post?._embedded?.["wp:term"] || [];
	const eventCategories: EventCategoryTerm[] = allTermGroups
		.flat()
		.filter((term) => term.taxonomy === "tribe_events_cat");

	// Event-specific meta (The Events Calendar registers these in REST API)
	const eventMeta = post?.meta || {};
	const startDate: string | null = eventMeta._EventStartDate || null;
	const endDate: string | null = eventMeta._EventEndDate || null;
	const allDay: boolean = !!eventMeta._EventAllDay;
	const venueId: number | null = eventMeta._EventVenueID || null;
	const externalUrl: string | null = eventMeta._EventURL || null;
	const eventCost: string = eventMeta._EventCost || "";
	const eventCurrencySymbol: string = eventMeta._EventCurrencySymbol || "";

	// Fetch venue name if venueId exists
	const venueName = useSelect(
		(select) => {
			if (!venueId) {
				return "";
			}
			// @ts-ignore
			const venuePost = select(coreStore).getEntityRecord("postType", "tribe_venue", venueId);
			return venuePost?.title?.rendered || "";
		},
		[venueId]
	);

	// Fetch accent colors for event category pills
	const categoryAccentColors = useSelect(
		(select) => {
			if (!eventCategories.length) {
				return {} as Record<number, string>;
			}
			const colors: Record<number, string> = {};
			for (const cat of eventCategories) {
				// @ts-ignore
				const term = select(coreStore).getEntityRecord("taxonomy", "tribe_events_cat", cat.id);
				colors[cat.id] = term?.meta?.accent_color || "";
			}
			return colors;
		},
		[eventCategories.map((c) => c.id).join(",")]
	);

	// Format date/time display and ISO datetime attribute
	const dateTimeDisplay = formatEventDateRange(startDate, endDate, allDay);
	const dateTimeIso = buildIsoDatetime(startDate, endDate, allDay);

	// Rename block based on event title
	const prevTitleRef = useRef(eventTitle);
	useEffect(() => {
		if (eventTitle !== prevTitleRef.current) {
			renameBlock(eventTitle, prevTitleRef.current, clientId);
			prevTitleRef.current = eventTitle;
		}
	}, [eventTitle, clientId]);

	return (
		<>
			<section
				{...useBlockProps({
					className: cn({
						"event-hero grid overflow-visible min-h-[min(800px,100vh)] not-discourse": true,
						"-mt-(--header-height)": hasHeader
					})
				})}
			>
				{/* Layer 1: Background image — col-1/row-1, stretches to fill grid */}
				<div className="col-start-1 row-start-1 overflow-hidden bg-accent h-[calc(var(--header-height)+300px)] md:h-[calc(var(--header-height)+450px)] mask-b-from-40% mask-b-to-100%">
					{(displayContent || featuredMediaUrl) && (
						<>
							{featuredMediaUrl ? (
								<img
									src={featuredMediaUrl}
									alt=""
									role="presentation"
									className="w-full h-full object-cover"
								/>
							) : (
								<div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
									{__("Featured Image", "takt")}
								</div>
							)}
						</>
					)}
				</div>

				{/* Layer 2: Gradient — col-1/row-1, extends below for subsequent sections */}
				<div className="col-start-1 row-start-1 self-start relative -z-1">
					<div className="top-gradient" />
				</div>

				{/* Layer 3: Content — col-1/row-1, aligned to bottom */}
				<div className="col-start-1 row-start-1 self-end relative z-10 pb-8 sm:pb-16 pt-[var(--header-height)]">
					<div className="container">
						<div className="max-w-[700px] mr-auto">
							{/* Upper Group: Category Pills + Title */}
							<div className="flex flex-col gap-6">
								{/* Category Pills */}
								{(displayContent || eventCategories.length > 0) && (
									<div className="flex flex-wrap gap-2">
										{eventCategories.length > 0 ? (
											eventCategories.map((cat) => {
												const accentColor = categoryAccentColors[cat.id] || "";
												return (
													<span
														key={cat.id}
														className={cn({
															"inline-flex items-center justify-center px-2 py-2 rounded-full bg-accent-lighter border border-accent text-sm font-medium uppercase leading-[1.1] whitespace-nowrap shrink-0 text-charcoal": true,
															[accentColor]: !!accentColor
														})}
													>
														{cat.name}
													</span>
												);
											})
										) : (
											<span className="inline-flex items-center justify-center px-2 py-2 rounded-full bg-accent-lighter border border-accent text-sm font-medium uppercase leading-[1.1] whitespace-nowrap shrink-0 text-charcoal">
												{__("Event Category", "takt")}
											</span>
										)}
									</div>
								)}

								{/* Event Title */}
								{(displayContent || eventTitle) && (
									<h1 className="text-header-0 text-charcoal">{eventTitle}</h1>
								)}
							</div>

							{/* Lower Group: Date/Time, Venue, External Link */}
							<div className="mt-12 flex flex-col gap-1">
								{/* Date/Time Line */}
								<p className="font-heading text-lg leading-[1.2] text-charcoal">
									<time dateTime={dateTimeIso || undefined}>{dateTimeDisplay}</time>
								</p>

								{/* Venue Line */}
								{(displayContent || venueName) && (
									<p className="text-lg font-medium leading-[1.2] text-charcoal">
										{venueName || __("Venue Name", "takt")}
									</p>
								)}

								{/* Cost Line */}
								{(displayContent || eventCost) && (
									<p className="text-lg font-medium leading-[1.2] text-charcoal">
										{eventCost ? `${eventCurrencySymbol}${eventCost}` : __("Event Cost", "takt")}
									</p>
								)}

								{/* External Link Button */}
								{(displayContent || externalUrl) && (
									<a
										href={externalUrl || "#"}
										className="btn-primary mt-6 inline-flex self-start"
										target="_blank"
										rel="noopener noreferrer"
									>
										{__("Visit Event Website", "takt")}
										<span className="sr-only">
											{`: ${eventTitle} ${__("(opens in a new tab)", "takt")}`}
										</span>
									</a>
								)}
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
