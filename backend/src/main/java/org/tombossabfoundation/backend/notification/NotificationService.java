package org.tombossabfoundation.backend.notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.mail.MailProperties;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionalEventListener;

/**
 * Outbound email to the foundation inbox. Async and best-effort: it runs only
 * after the submission's transaction commits (so no email for a submission that
 * wasn't saved), and a mail failure is logged, never surfaced to the caller.
 */
@Service
public class NotificationService {

	private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

	private final JavaMailSender mailSender;
	private final MailProperties mailProperties;
	private final NotificationProperties notificationProperties;

	public NotificationService(JavaMailSender mailSender, MailProperties mailProperties,
			NotificationProperties notificationProperties) {
		this.mailSender = mailSender;
		this.mailProperties = mailProperties;
		this.notificationProperties = notificationProperties;
	}

	/** fallbackExecution: also sent when published outside a transaction. */
	@Async("mailExecutor")
	@TransactionalEventListener(fallbackExecution = true)
	public void onNotification(FoundationNotification notification) {
		notifyFoundation(notification.subject(), notification.body(), notification.replyTo());
	}

	/**
	 * From is the authenticated SMTP account (SPF/DMARC-correct); Reply-To is
	 * the submitter, so replying from the inbox still reaches them.
	 */
	void notifyFoundation(String subject, String body, String replyTo) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom(mailProperties.getUsername());
		message.setTo(notificationProperties.to());
		message.setReplyTo(replyTo);
		// Strip CR/LF so a user-supplied name can't inject extra mail headers.
		message.setSubject(subject.replaceAll("[\\r\\n]", " "));
		message.setText(body);
		try {
			mailSender.send(message);
		} catch (MailException e) {
			log.error("Failed to send notification '{}'", subject, e);
		}
	}

}
