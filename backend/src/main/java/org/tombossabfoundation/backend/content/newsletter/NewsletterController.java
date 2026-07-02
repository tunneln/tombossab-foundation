package org.tombossabfoundation.backend.content.newsletter;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/newsletters")
public class NewsletterController {

	private final NewsletterService service;

	public NewsletterController(NewsletterService service) {
		this.service = service;
	}

	@GetMapping
	public List<NewsletterResponse> list() {
		return service.findAll();
	}

}
