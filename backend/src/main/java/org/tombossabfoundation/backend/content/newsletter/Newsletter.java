package org.tombossabfoundation.backend.content.newsletter;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDate;

@Entity
public class Newsletter {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	/** The stable string id the site has always used, e.g. "march-2026". */
	@Column(nullable = false, unique = true)
	private String publicId;

	@Column(nullable = false)
	private String title;

	@Column(nullable = false)
	private String issue;

	/** First day of the issue month; display fields derive from it. */
	@Column(nullable = false, unique = true)
	private LocalDate issueDate;

	@Column(nullable = false)
	private String headline;

	@Column(nullable = false)
	private String blurb;

	@Column(nullable = false)
	private String cover;

	@Column(nullable = false)
	private String file;

	protected Newsletter() {
	}

	public Long getId() {
		return id;
	}

	public String getPublicId() {
		return publicId;
	}

	public String getTitle() {
		return title;
	}

	public String getIssue() {
		return issue;
	}

	public LocalDate getIssueDate() {
		return issueDate;
	}

	public String getHeadline() {
		return headline;
	}

	public String getBlurb() {
		return blurb;
	}

	public String getCover() {
		return cover;
	}

	public String getFile() {
		return file;
	}

}
