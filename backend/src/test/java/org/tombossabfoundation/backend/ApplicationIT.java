package org.tombossabfoundation.backend;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.icegreen.greenmail.configuration.GreenMailConfiguration;
import com.icegreen.greenmail.junit5.GreenMailExtension;
import com.icegreen.greenmail.util.ServerSetupTest;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.tombossabfoundation.backend.engagement.contact.ContactSubmissionRepository;
import org.tombossabfoundation.backend.engagement.subscription.NewsletterSubscriberRepository;

/**
 * Full-stack proof: real HTTP through the security chain, Flyway-seeded
 * Postgres (Testcontainers), and SMTP received by GreenMail.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, properties = {
		"spring.mail.host=127.0.0.1",
		"spring.mail.port=3025",
		"spring.mail.properties.mail.smtp.auth=false",
		"spring.mail.properties.mail.smtp.starttls.enable=false",
		"app.ratelimit.capacity=100"
})
class ApplicationIT extends AbstractPostgresIT {

	@RegisterExtension
	static GreenMailExtension greenMail = new GreenMailExtension(ServerSetupTest.SMTP)
			.withConfiguration(GreenMailConfiguration.aConfig().withDisabledAuthentication());

	@Autowired
	private TestRestTemplate rest;

	@Autowired
	private ContactSubmissionRepository contactSubmissions;

	@Autowired
	private NewsletterSubscriberRepository subscribers;

	@Test
	void seededContent_isServedThroughTheFullStack() {
		ResponseEntity<String> response = rest.getForEntity("/api/recipients", String.class);
		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertTrue(response.getBody().contains("\"id\":\"mattania-biniam-2025\""));
		assertTrue(response.getBody().contains("\"year\":\"2025\""));

		ResponseEntity<String> newsletters = rest.getForEntity("/api/newsletters", String.class);
		assertTrue(newsletters.getBody().contains("\"date\":\"2026-06\""));

		ResponseEntity<String> events = rest.getForEntity("/api/events", String.class);
		assertTrue(events.getBody().contains("\"eventDate\":\"2026-06-27\""));
	}

	@Test
	void contactSubmission_isPersisted_andNotificationEmailArrives() throws Exception {
		ResponseEntity<String> response = rest.postForEntity("/api/contact",
				json("""
						{"name":"IT Visitor","email":"visitor@example.com","phone":"5550001111","message":"Hi"}"""),
				String.class);
		assertEquals(HttpStatus.ACCEPTED, response.getStatusCode());

		assertEquals(1, contactSubmissions.count());
		assertEquals("IT Visitor", contactSubmissions.findAll().get(0).getName());

		assertTrue(greenMail.waitForIncomingEmail(5000, 1), "notification email should arrive");
		MimeMessage message = greenMail.getReceivedMessages()[0];
		assertEquals("Official Contact Message From IT Visitor", message.getSubject());
		assertEquals("visitor@example.com", message.getReplyTo()[0].toString());
		assertEquals("contact@tombossabfoundation.org", message.getAllRecipients()[0].toString());
	}

	@Test
	void subscription_isIdempotentAcrossRepeatedPosts() {
		ResponseEntity<String> first = rest.postForEntity("/api/subscriptions",
				json("""
						{"email":"Reader@Example.com"}"""), String.class);
		assertEquals(HttpStatus.CREATED, first.getStatusCode());

		ResponseEntity<String> second = rest.postForEntity("/api/subscriptions",
				json("""
						{"email":"reader@example.com"}"""), String.class);
		assertEquals(HttpStatus.OK, second.getStatusCode());

		assertEquals(1, subscribers.count());
		assertEquals("reader@example.com", subscribers.findAll().get(0).getEmail());
	}

	@Test
	void unlistedPath_isDeniedThroughTheRealChain() {
		ResponseEntity<String> response = rest.getForEntity("/api/not-a-real-endpoint", String.class);
		assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
	}

	private static HttpEntity<String> json(String body) {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		return new HttpEntity<>(body, headers);
	}

}
