package org.tombossabfoundation.backend.content.recipient;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecipientRepository extends JpaRepository<Recipient, Long> {

	/**
	 * Most recent award first, then newer scholars first (first award year desc);
	 * id ASC preserves seed order after that (display contract).
	 */
	List<Recipient> findAllByOrderByAwardYearDescFirstAwardYearDescIdAsc();

}
