package org.tombossabfoundation.backend.content.event;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDate;

@Entity
public class Event {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	/** Nullable: an event without a detail page (e.g. the inauguration) has no slug. */
	@Column(unique = true)
	private String slug;

	@Column(nullable = false)
	private String title;

	@Column(nullable = false)
	private LocalDate eventDate;

	@Column(nullable = false)
	private String timeLabel;

	@Column(nullable = false)
	private String venue;

	@Column(nullable = false)
	private String city;

	@Column(nullable = false)
	private String image;

	@Column(nullable = false)
	private String imageAlt;

	protected Event() {
	}

	public Long getId() {
		return id;
	}

	public String getSlug() {
		return slug;
	}

	public String getTitle() {
		return title;
	}

	public LocalDate getEventDate() {
		return eventDate;
	}

	public String getTimeLabel() {
		return timeLabel;
	}

	public String getVenue() {
		return venue;
	}

	public String getCity() {
		return city;
	}

	public String getImage() {
		return image;
	}

	public String getImageAlt() {
		return imageAlt;
	}

}
