package org.tombossabfoundation.backend.notification;

import org.springframework.boot.context.properties.ConfigurationProperties;

/** @param to the foundation inbox that receives engagement notifications */
@ConfigurationProperties(prefix = "app.mail")
public record NotificationProperties(String to) {
}
