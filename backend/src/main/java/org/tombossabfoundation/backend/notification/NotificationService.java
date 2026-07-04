package org.tombossabfoundation.backend.notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.mail.MailProperties;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * Outbound email to the foundation inbox. Async and best-effort: submissions
 * are already persisted before this runs, so a mail failure is logged, never
 * surfaced to the caller.
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

	/**
	 * From is the authenticated SMTP account (SPF/DMARC-correct); Reply-To is
	 * the submitter, so replying from the inbox still reaches them.
	 */
	@Async("mailExecutor")
	public void notifyFoundation(String subject, String body, String replyTo) {
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
