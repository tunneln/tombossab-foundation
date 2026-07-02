package org.tombossabfoundation.backend.engagement.volunteer;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.tombossabfoundation.backend.config.SecurityConfig;

@WebMvcTest(VolunteerController.class)
@Import(SecurityConfig.class)
class VolunteerControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockitoBean
	private VolunteerService service;

	@Test
	void postValidRequest_withOptionalFieldsOmitted_isAccepted() throws Exception {
		String body = """
				{"name":"Vol Unteer","email":"vol@example.com","phone":"5559876543","message":"I want to help"}""";
		mockMvc.perform(post("/api/volunteer").contentType(MediaType.APPLICATION_JSON).content(body))
				.andExpect(status().isAccepted())
				.andExpect(jsonPath("$.status").value("accepted"));

		ArgumentCaptor<VolunteerRequest> captor = ArgumentCaptor.forClass(VolunteerRequest.class);
		verify(service).submit(captor.capture());
		assertEquals("Vol Unteer", captor.getValue().name());
		assertNull(captor.getValue().address());
		assertNull(captor.getValue().job());
	}

	@Test
	void postMissingRequiredMessage_returns400WithFieldError() throws Exception {
		String body = """
				{"name":"Vol Unteer","email":"vol@example.com","phone":"5559876543"}""";
		mockMvc.perform(post("/api/volunteer").contentType(MediaType.APPLICATION_JSON).content(body))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.errors.message").exists());
	}

}
