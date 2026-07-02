package org.tombossabfoundation.backend.content.recipient;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RecipientService {

	private final RecipientRepository repository;

	public RecipientService(RecipientRepository repository) {
		this.repository = repository;
	}

	@Transactional(readOnly = true)
	public List<RecipientResponse> findAll() {
		return repository.findAllByOrderByAwardYearDescIdAsc().stream()
				.map(RecipientResponse::from)
				.toList();
	}

}
