package org.tombossabfoundation.backend.content.recipient;

import java.util.List;

/** Field names/types intentionally mirror frontend/data/recipients.json. */
public record RecipientResponse(
		String id,
		String slug,
		String name,
		String year,
		String cohort,
		String scholarship,
		String headline,
		String photo,
		String photoAlt,
		String heritage,
		String school,
		String major,
		List<String> highlights,
		String blurb,
		List<String> story,
		String quote,
		String quoteAttribution) {

	static RecipientResponse from(Recipient recipient) {
		return new RecipientResponse(
				recipient.getPublicId(),
				recipient.getSlug(),
				recipient.getName(),
				String.valueOf(recipient.getAwardYear()),
				recipient.getCohort(),
				recipient.getScholarship(),
				recipient.getHeadline(),
				recipient.getPhoto(),
				recipient.getPhotoAlt(),
				recipient.getHeritage(),
				recipient.getSchool(),
				recipient.getMajor(),
				recipient.getHighlights(),
				recipient.getBlurb(),
				recipient.getStory(),
				recipient.getQuote(),
				recipient.getQuoteAttribution());
	}

}
