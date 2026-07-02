package org.tombossabfoundation.backend.engagement.volunteer;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.tombossabfoundation.backend.notification.NotificationService;

@Service
public class VolunteerService {

	private final VolunteerSubmissionRepository repository;
	private final NotificationService notificationService;

	public VolunteerService(VolunteerSubmissionRepository repository, NotificationService notificationService) {
		this.repository = repository;
		this.notificationService = notificationService;
	}

	@Transactional
	public void submit(VolunteerRequest request) {
		repository.save(new VolunteerSubmission(request.name(), request.email(), request.phone(),
				request.address(), request.job(), request.message()));
		notificationService.notifyFoundation(
				"Volunteer Form From " + request.name(),
				"Name: " + request.name() + "\nPhone: " + request.phone() + "\nEmail: " + request.email()
						+ "\nOccupation: " + orNone(request.job()) + "\nAddress: " + orNone(request.address())
						+ "\nMessage: " + request.message(),
				request.email());
	}

	private static String orNone(String value) {
		return value == null || value.isBlank() ? "-" : value;
	}

}
