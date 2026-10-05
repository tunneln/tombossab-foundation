package org.tombossabfoundation.backend.engagement.subscription;

import java.util.Locale;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.tombossabfoundation.backend.notification.FoundationNotification;

@Service
public class SubscriptionService {

	private final NewsletterSubscriberRepository repository;
	private final ApplicationEventPublisher events;

	public SubscriptionService(NewsletterSubscriberRepository repository, ApplicationEventPublisher events) {
		this.repository = repository;
		this.events = events;
	}

	/**
	 * Idempotent: re-subscribing an existing address is not an error.
	 *
	 * @return true if a new subscriber was created
	 */
	@Transactional(propagation = Propagation.NOT_SUPPORTED)
	public boolean subscribe(SubscriptionRequest request) {
		String email = request.email().trim().toLowerCase(Locale.ROOT);
		if (repository.existsByEmail(email)) {
			return false;
		}
		try {
			repository.save(new NewsletterSubscriber(email));
		} catch (DataIntegrityViolationException raced) {
			// Concurrent duplicate — the unique constraint won; still a success.
			return false;
		}
		events.publishEvent(new FoundationNotification("New Newsletter Subscription", "Email: " + email, email));
		return true;
	}

}
