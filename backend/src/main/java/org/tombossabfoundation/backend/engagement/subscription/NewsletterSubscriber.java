package org.tombossabfoundation.backend.engagement.subscription;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.Instant;

@Entity
public class NewsletterSubscriber {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	/** Stored normalized (trimmed, lower-cased). */
	@Column(nullable = false, unique = true)
	private String email;

	@Column(nullable = false)
	private Instant createdAt;

	protected NewsletterSubscriber() {
	}

	public NewsletterSubscriber(String email) {
		this.email = email;
		this.createdAt = Instant.now();
	}

	public Long getId() {
		return id;
	}

	public String getEmail() {
		return email;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

}
