package org.tombossabfoundation.backend.content.newsletter;

import java.time.format.TextStyle;
import java.util.Locale;

/** Field names/types intentionally mirror frontend/data/newsletters.json. */
public record NewsletterResponse(
		String id,
		String title,
		String issue,
		String date,
		String month,
		String year,
		String headline,
		String blurb,
		String cover,
		String file) {

	static NewsletterResponse from(Newsletter newsletter) {
		var issueDate = newsletter.getIssueDate();
		return new NewsletterResponse(
				newsletter.getPublicId(),
				newsletter.getTitle(),
				newsletter.getIssue(),
				"%d-%02d".formatted(issueDate.getYear(), issueDate.getMonthValue()),
				issueDate.getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH),
				String.valueOf(issueDate.getYear()),
				newsletter.getHeadline(),
				newsletter.getBlurb(),
				newsletter.getCover(),
				newsletter.getFile());
	}

}
