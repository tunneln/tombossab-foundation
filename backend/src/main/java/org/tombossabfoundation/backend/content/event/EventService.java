package org.tombossabfoundation.backend.content.event;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EventService {

	private final EventRepository repository;

	public EventService(EventRepository repository) {
		this.repository = repository;
	}

	@Transactional(readOnly = true)
	public List<EventResponse> findAll() {
		return repository.findAllByOrderByEventDateDesc().stream()
				.map(EventResponse::from)
				.toList();
	}

}
