package org.tombossabfoundation.backend.engagement.subscription;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SubscriptionRequest(
		@NotBlank @Email @Size(max = 320) String email) {
}
