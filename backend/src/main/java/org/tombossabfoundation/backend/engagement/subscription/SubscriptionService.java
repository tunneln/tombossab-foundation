package org.tombossabfoundation.backend.engagement.subscription;

import java.util.Locale;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.tombossabfoundation.backend.notification.NotificationService;

@Service
public class SubscriptionService {

	private final NewsletterSubscriberRepository repository;
	private final NotificationService notificationService;

	public SubscriptionService(NewsletterSubscriberRepository repository, NotificationService notificationService) {
		this.repository = repository;
		this.notificationService = notificationService;
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
		notificationService.notifyFoundation("New Newsletter Subscription", "Email: " + email, email);
		return true;
	}

}
