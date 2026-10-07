package org.tombossabfoundation.backend.content;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.tombossabfoundation.backend.AbstractPostgresIT;
import org.tombossabfoundation.backend.content.event.Event;
import org.tombossabfoundation.backend.content.event.EventRepository;
import org.tombossabfoundation.backend.content.newsletter.Newsletter;
import org.tombossabfoundation.backend.content.newsletter.NewsletterRepository;
import org.tombossabfoundation.backend.content.recipient.Recipient;
import org.tombossabfoundation.backend.content.recipient.RecipientRepository;
import org.tombossabfoundation.backend.engagement.subscription.NewsletterSubscriber;
import org.tombossabfoundation.backend.engagement.subscription.NewsletterSubscriberRepository;

/**
 * Runs Flyway (schema + seeds) against real Postgres and pins the seeded
 * content and its ordering contracts.
 */
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class ContentRepositoryIT extends AbstractPostgresIT {

	@Autowired
	private RecipientRepository recipients;

	@Autowired
	private NewsletterRepository newsletters;

	@Autowired
	private EventRepository events;

	@Autowired
	private NewsletterSubscriberRepository subscribers;

	@Test
	void seededRecipients_orderLatestAwardFirst_thenNewerScholarsFirst() {
		List<Recipient> all = recipients.findAllByOrderByAwardYearDescFirstAwardYearDescIdAsc();
		assertEquals(3, all.size());
		// 2026 awards first; within them the new scholar (first award 2026) before
		// the repeat recipient (first award 2025); then the 2025 recipient.
		assertEquals(List.of("Kaleb Alemayehu", "Mattania Biniam", "Elim Girma"),
				all.stream().map(Recipient::getName).toList());
		Recipient mattania = all.get(1);
		assertEquals("mattania-biniam-2025", mattania.getPublicId());
		assertEquals(2026, mattania.getAwardYear());
		assertEquals(2025, mattania.getFirstAwardYear());
		assertEquals(List.of("4.2 Weighted GPA", "Church Youth Leader", "Varsity Basketball Captain"),
				mattania.getHighlights());
		Recipient kaleb = all.get(0);
		assertEquals(2026, kaleb.getFirstAwardYear());
		assertEquals(3, kaleb.getHighlights().size());
		assertEquals(3, kaleb.getStory().size());
		assertEquals(2025, all.get(2).getFirstAwardYear());
	}

	@Test
	void seededNewsletters_orderNewestIssueFirst() {
		List<Newsletter> all = newsletters.findAllByOrderByIssueDateDesc();
		assertEquals(4, all.size());
		assertEquals("september-2026", all.get(0).getPublicId());
		assertEquals("june-2026", all.get(1).getPublicId());
		assertEquals("april-2026", all.get(2).getPublicId());
		assertEquals("march-2026", all.get(3).getPublicId());
	}

	@Test
	void seededEvents_orderNewestFirst_inaugurationHasNoSlug() {
		List<Event> all = events.findAllByOrderByEventDateDesc();
		assertEquals(3, all.size());
		assertEquals("coffee-women-empowerment-1", all.get(0).getSlug());
		assertEquals("community-field-day-2025", all.get(1).getSlug());
		assertNull(all.get(2).getSlug());
		assertEquals("Memorial of Tombossa Negusse | Foundation Inauguration", all.get(2).getTitle());
	}

	@Test
	void duplicateSubscriberEmail_rejectedByUniqueConstraint() {
		subscribers.saveAndFlush(new NewsletterSubscriber("dup@example.com"));
		assertThrows(DataIntegrityViolationException.class,
				() -> subscribers.saveAndFlush(new NewsletterSubscriber("dup@example.com")));
	}

}
