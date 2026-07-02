package org.tombossabfoundation.backend.engagement.contact;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContactRequest(
		@NotBlank @Size(max = 200) String name,
		@NotBlank @Email @Size(max = 320) String email,
		@NotBlank @Size(max = 40) String phone,
		@NotBlank @Size(max = 5000) String message) {
}
