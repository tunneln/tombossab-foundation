package org.tombossabfoundation.backend.engagement.contact;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.tombossabfoundation.backend.notification.FoundationNotification;

@Service
public class ContactService {

	private final ContactSubmissionRepository repository;
	private final ApplicationEventPublisher events;

	public ContactService(ContactSubmissionRepository repository, ApplicationEventPublisher events) {
		this.repository = repository;
		this.events = events;
	}

	/** The submission is the record of truth; the email is best-effort, sent after commit. */
	@Transactional
	public void submit(ContactRequest request) {
		repository.save(new ContactSubmission(request.name(), request.email(), request.phone(), request.message()));
		events.publishEvent(new FoundationNotification(
				"Official Contact Message From " + request.name(),
				"-Contact Information-\nPhone: " + request.phone() + " | Email: " + request.email()
						+ "\n\n-Message-\n" + request.message(),
				request.email()));
	}

}
