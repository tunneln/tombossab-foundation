package org.tombossabfoundation.backend.notification;

/**
 * An email for the foundation inbox, published by the engagement services and
 * sent by {@link NotificationService} once the submission's transaction commits.
 */
public record FoundationNotification(String subject, String body, String replyTo) {
}
