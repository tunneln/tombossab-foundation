package org.tombossabfoundation.backend.engagement.volunteer;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.tombossabfoundation.backend.common.StatusResponse;

@RestController
@RequestMapping("/api/volunteer")
public class VolunteerController {

	private final VolunteerService service;

	public VolunteerController(VolunteerService service) {
		this.service = service;
	}

	@PostMapping
	@ResponseStatus(HttpStatus.ACCEPTED)
	public StatusResponse submit(@Valid @RequestBody VolunteerRequest request) {
		service.submit(request);
		return new StatusResponse("accepted");
	}

}
