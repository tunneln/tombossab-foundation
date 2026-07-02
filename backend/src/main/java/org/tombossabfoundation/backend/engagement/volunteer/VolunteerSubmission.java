package org.tombossabfoundation.backend.engagement.volunteer;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.Instant;

@Entity
public class VolunteerSubmission {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false)
	private String email;

	@Column(nullable = false)
	private String phone;

	/** Optional on the form. */
	private String address;

	/** Occupation; optional on the form. */
	private String job;

	@Column(nullable = false)
	private String message;

	@Column(nullable = false)
	private Instant createdAt;

	protected VolunteerSubmission() {
	}

	public VolunteerSubmission(String name, String email, String phone, String address, String job, String message) {
		this.name = name;
		this.email = email;
		this.phone = phone;
		this.address = address;
		this.job = job;
		this.message = message;
		this.createdAt = Instant.now();
	}

	public Long getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public String getEmail() {
		return email;
	}

	public String getPhone() {
		return phone;
	}

	public String getAddress() {
		return address;
	}

	public String getJob() {
		return job;
	}

	public String getMessage() {
		return message;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

}
