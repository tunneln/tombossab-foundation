package org.tombossabfoundation.backend.config;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.tombossabfoundation.backend.content.recipient.RecipientController;
import org.tombossabfoundation.backend.content.recipient.RecipientService;

/** Pins the closed-by-default policy and the CORS allowlist. */
@WebMvcTest(RecipientController.class)
@Import(SecurityConfig.class)
class SecurityConfigTest {

	@Autowired
	private MockMvc mockMvc;

	@MockitoBean
	private RecipientService service;

	@Test
	void unlistedPath_isDenied() throws Exception {
		mockMvc.perform(get("/api/not-a-real-endpoint"))
				.andExpect(status().isForbidden());
	}

	@Test
	void corsPreflight_fromAllowedOrigin_isAccepted() throws Exception {
		mockMvc.perform(options("/api/contact")
				.header("Origin", "https://tombossabfoundation.org")
				.header("Access-Control-Request-Method", "POST"))
				.andExpect(status().isOk())
				.andExpect(header().string("Access-Control-Allow-Origin", "https://tombossabfoundation.org"));
	}

	@Test
	void corsPreflight_fromForeignOrigin_isRejected() throws Exception {
		mockMvc.perform(options("/api/contact")
				.header("Origin", "https://evil.example")
				.header("Access-Control-Request-Method", "POST"))
				.andExpect(status().isForbidden());
	}

}
