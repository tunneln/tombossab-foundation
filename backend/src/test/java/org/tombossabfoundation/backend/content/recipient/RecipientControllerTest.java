package org.tombossabfoundation.backend.content.recipient;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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

@WebMvcTest(RecipientController.class)
@Import(SecurityConfig.class)
class RecipientControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockitoBean
	private RecipientService service;

	@Test
	void get_returnsRecipientsWithJsonShapeOfTheOldDataFile() throws Exception {
		when(service.findAll()).thenReturn(List.of(new RecipientResponse(
				"mattania-biniam-2025", "mattania-biniam", "Mattania Biniam", "2025", "2025–2026",
				"East African Youth Scholarship", "Engineering Impact Through Analytics",
				"/recipients/mattania-biniam.jpg", "Mattania Biniam, recipient", "Eritrean-American",
				"Southern Methodist University", "Management Science",
				List.of("4.2 Weighted GPA"), "Blurb", List.of("Story paragraph"), "Quote", "Mattania Biniam")));

		mockMvc.perform(get("/api/recipients"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].id").value("mattania-biniam-2025"))
				.andExpect(jsonPath("$[0].year").value("2025"))
				.andExpect(jsonPath("$[0].highlights[0]").value("4.2 Weighted GPA"))
				.andExpect(jsonPath("$[0].photoAlt").value("Mattania Biniam, recipient"));
	}

	@Test
	void post_isDeniedByDefaultPolicy() throws Exception {
		mockMvc.perform(post("/api/recipients"))
				.andExpect(status().isForbidden());
	}

}
