package org.tombossabfoundation.backend.content.recipient;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecipientRepository extends JpaRepository<Recipient, Long> {

	/** Newest cohort first; id ASC preserves seed order within a year (display contract). */
	List<Recipient> findAllByOrderByAwardYearDescIdAsc();

}
