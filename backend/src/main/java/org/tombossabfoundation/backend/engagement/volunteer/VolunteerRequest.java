package org.tombossabfoundation.backend.engagement.volunteer;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** address and job are optional on the volunteer form. */
public record VolunteerRequest(
		@NotBlank @Size(max = 200) String name,
		@NotBlank @Email @Size(max = 320) String email,
		@NotBlank @Size(max = 40) String phone,
		@Size(max = 500) String address,
		@Size(max = 200) String job,
		@NotBlank @Size(max = 5000) String message) {
}
