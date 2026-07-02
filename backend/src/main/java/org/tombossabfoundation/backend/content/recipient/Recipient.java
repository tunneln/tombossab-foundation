package org.tombossabfoundation.backend.content.recipient;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.util.List;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
public class Recipient {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	/** The stable string id the site has always used, e.g. "mattania-biniam-2025". */
	@Column(nullable = false, unique = true)
	private String publicId;

	@Column(nullable = false, unique = true)
	private String slug;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false)
	private Integer awardYear;

	@Column(nullable = false)
	private String cohort;

	@Column(nullable = false)
	private String scholarship;

	@Column(nullable = false)
	private String headline;

	@Column(nullable = false)
	private String photo;

	@Column(nullable = false)
	private String photoAlt;

	@Column(nullable = false)
	private String heritage;

	@Column(nullable = false)
	private String school;

	@Column(nullable = false)
	private String major;

	@JdbcTypeCode(SqlTypes.JSON)
	@Column(nullable = false)
	private List<String> highlights;

	@Column(nullable = false)
	private String blurb;

	@JdbcTypeCode(SqlTypes.JSON)
	@Column(nullable = false)
	private List<String> story;

	@Column(nullable = false)
	private String quote;

	@Column(nullable = false)
	private String quoteAttribution;

	protected Recipient() {
	}

	public Long getId() {
		return id;
	}

	public String getPublicId() {
		return publicId;
	}

	public String getSlug() {
		return slug;
	}

	public String getName() {
		return name;
	}

	public Integer getAwardYear() {
		return awardYear;
	}

	public String getCohort() {
		return cohort;
	}

	public String getScholarship() {
		return scholarship;
	}

	public String getHeadline() {
		return headline;
	}

	public String getPhoto() {
		return photo;
	}

	public String getPhotoAlt() {
		return photoAlt;
	}

	public String getHeritage() {
		return heritage;
	}

	public String getSchool() {
		return school;
	}

	public String getMajor() {
		return major;
	}

	public List<String> getHighlights() {
		return highlights;
	}

	public String getBlurb() {
		return blurb;
	}

	public List<String> getStory() {
		return story;
	}

	public String getQuote() {
		return quote;
	}

	public String getQuoteAttribution() {
		return quoteAttribution;
	}

}
