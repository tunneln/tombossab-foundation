package org.tombossabfoundation.backend.content.event;

import java.time.LocalDate;

/** Field names intentionally mirror frontend/data/events.json. */
public record EventResponse(
		String slug,
		String title,
		LocalDate eventDate,
		String timeLabel,
		String venue,
		String city,
		String image,
		String imageAlt) {

	static EventResponse from(Event event) {
		return new EventResponse(
				event.getSlug(),
				event.getTitle(),
				event.getEventDate(),
				event.getTimeLabel(),
				event.getVenue(),
				event.getCity(),
				event.getImage(),
				event.getImageAlt());
	}

}
