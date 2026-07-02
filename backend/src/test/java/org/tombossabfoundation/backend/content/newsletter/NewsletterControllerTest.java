package org.tombossabfoundation.backend.content.newsletter;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.tombossabfoundation.backend.config.SecurityConfig;

@WebMvcTest(NewsletterController.class)
@Import(SecurityConfig.class)
class NewsletterControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockitoBean
	private NewsletterService service;

	@Test
	void get_returnsNewslettersWithJsonShapeOfTheOldDataFile() throws Exception {
		when(service.findAll()).thenReturn(List.of(new NewsletterResponse(
				"march-2026", "March 2026 Newsletter", "Issue #1", "2026-03", "March", "2026",
				"Breaking Barriers to Mental Health Care", "Blurb",
				"/newsletters/march-2026-cover.jpg", "/newsletters/march-2026-newsletter.pdf")));

		mockMvc.perform(get("/api/newsletters"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].id").value("march-2026"))
				.andExpect(jsonPath("$[0].date").value("2026-03"))
				.andExpect(jsonPath("$[0].month").value("March"))
				.andExpect(jsonPath("$[0].file").value("/newsletters/march-2026-newsletter.pdf"));
	}

}
