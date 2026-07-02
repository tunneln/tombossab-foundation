package org.tombossabfoundation.backend.engagement.contact;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.tombossabfoundation.backend.notification.NotificationService;

@Service
public class ContactService {

	private final ContactSubmissionRepository repository;
	private final NotificationService notificationService;

	public ContactService(ContactSubmissionRepository repository, NotificationService notificationService) {
		this.repository = repository;
		this.notificationService = notificationService;
	}

	/** The submission is the record of truth; the email is best-effort notification. */
	@Transactional
	public void submit(ContactRequest request) {
		repository.save(new ContactSubmission(request.name(), request.email(), request.phone(), request.message()));
		notificationService.notifyFoundation(
				"Official Contact Message From " + request.name(),
				"-Contact Information-\nPhone: " + request.phone() + " | Email: " + request.email()
						+ "\n\n-Message-\n" + request.message(),
				request.email());
	}

}
