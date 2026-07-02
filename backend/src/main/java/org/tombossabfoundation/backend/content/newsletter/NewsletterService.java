package org.tombossabfoundation.backend.content.newsletter;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NewsletterService {

	private final NewsletterRepository repository;

	public NewsletterService(NewsletterRepository repository) {
		this.repository = repository;
	}

	@Transactional(readOnly = true)
	public List<NewsletterResponse> findAll() {
		return repository.findAllByOrderByIssueDateDesc().stream()
				.map(NewsletterResponse::from)
				.toList();
	}

}
