package org.tombossabfoundation.backend.content.recipient;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/recipients")
public class RecipientController {

	private final RecipientService service;

	public RecipientController(RecipientService service) {
		this.service = service;
	}

	@GetMapping
	public List<RecipientResponse> list() {
		return service.findAll();
	}

}
