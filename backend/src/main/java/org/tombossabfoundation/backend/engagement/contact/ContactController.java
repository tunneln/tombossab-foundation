package org.tombossabfoundation.backend.engagement.contact;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.tombossabfoundation.backend.common.StatusResponse;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

	private final ContactService service;

	public ContactController(ContactService service) {
		this.service = service;
	}

	@PostMapping
	@ResponseStatus(HttpStatus.ACCEPTED)
	public StatusResponse submit(@Valid @RequestBody ContactRequest request) {
		service.submit(request);
		return new StatusResponse("accepted");
	}

}
