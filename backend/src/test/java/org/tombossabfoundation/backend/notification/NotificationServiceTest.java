package org.tombossabfoundation.backend.notification;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.autoconfigure.mail.MailProperties;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

/**
 * Replaces the old EmailServiceTest: the From==To behavior that test pinned
 * (and flagged as not-best-practice) is deliberately gone. From is the
 * authenticated SMTP account; Reply-To carries the submitter.
 */
@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

	@Mock
	private JavaMailSender mailSender;

	private NotificationService service;

	@BeforeEach
	void setUp() {
		MailProperties mailProperties = new MailProperties();
		mailProperties.setUsername("contact@tombossabfoundation.org");
		service = new NotificationService(mailSender, mailProperties,
				new NotificationProperties("contact@tombossabfoundation.org"));
	}

	@Test
	void notifyFoundation_setsSmtpAccountAsFrom_andSubmitterAsReplyTo() {
		service.notifyFoundation("Subject line", "Body text", "visitor@example.com");

		ArgumentCaptor<SimpleMailMessage> captor = ArgumentCaptor.forClass(SimpleMailMessage.class);
		verify(mailSender).send(captor.capture());
		SimpleMailMessage sent = captor.getValue();
		assertEquals("contact@tombossabfoundation.org", sent.getFrom());
		assertArrayEquals(new String[] { "contact@tombossabfoundation.org" }, sent.getTo());
		assertEquals("visitor@example.com", sent.getReplyTo());
		assertEquals("Subject line", sent.getSubject());
		assertEquals("Body text", sent.getText());
	}

	@Test
	void smtpFailure_isSwallowed_submissionsMustNotFailOnMail() {
		doThrow(new MailSendException("boom")).when(mailSender).send(any(SimpleMailMessage.class));
		assertDoesNotThrow(() -> service.notifyFoundation("s", "b", "visitor@example.com"));
	}

}
