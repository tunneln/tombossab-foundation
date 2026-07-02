package org.tombossabfoundation.backend.engagement.subscription;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.tombossabfoundation.backend.common.StatusResponse;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

	private final SubscriptionService service;

	public SubscriptionController(SubscriptionService service) {
		this.service = service;
	}

	/** 201 for a new subscriber, 200 when the address was already subscribed. */
	@PostMapping
	public ResponseEntity<StatusResponse> subscribe(@Valid @RequestBody SubscriptionRequest request) {
		boolean created = service.subscribe(request);
		return ResponseEntity.status(created ? HttpStatus.CREATED : HttpStatus.OK)
				.body(new StatusResponse("subscribed"));
	}

}
