package org.tombossabfoundation.backend.engagement.volunteer;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.tombossabfoundation.backend.notification.FoundationNotification;

@Service
public class VolunteerService {

	private final VolunteerSubmissionRepository repository;
	private final ApplicationEventPublisher events;

	public VolunteerService(VolunteerSubmissionRepository repository, ApplicationEventPublisher events) {
		this.repository = repository;
		this.events = events;
	}

	@Transactional
	public void submit(VolunteerRequest request) {
		repository.save(new VolunteerSubmission(request.name(), request.email(), request.phone(),
				request.address(), request.job(), request.message()));
		events.publishEvent(new FoundationNotification(
				"Volunteer Form From " + request.name(),
				"Name: " + request.name() + "\nPhone: " + request.phone() + "\nEmail: " + request.email()
						+ "\nOccupation: " + orNone(request.job()) + "\nAddress: " + orNone(request.address())
						+ "\nMessage: " + request.message(),
				request.email()));
	}

	private static String orNone(String value) {
		return value == null || value.isBlank() ? "-" : value;
	}

}
