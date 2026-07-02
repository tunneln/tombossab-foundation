package org.tombossabfoundation.backend.content.newsletter;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NewsletterRepository extends JpaRepository<Newsletter, Long> {

	List<Newsletter> findAllByOrderByIssueDateDesc();

}
