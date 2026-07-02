package org.tombossabfoundation.backend.engagement.contact;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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

/**
 * HTTP contract for the contact form. Carries forward every behavior the old
 * EmailControllerTest pinned (2xx + delegation, 400 on malformed JSON, 405 on
 * GET) under the new, structured endpoint.
 */
@WebMvcTest(ContactController.class)
@Import(SecurityConfig.class)
class ContactControllerTest {

	private static final String VALID = """
			{"name":"Test User","email":"visitor@example.com","phone":"5551234567","message":"Hello"}""";

	@Autowired
	private MockMvc mockMvc;

	@MockitoBean
	private ContactService service;

	@Test
	void postValidRequest_isAcceptedAndDelegatesMappedFields() throws Exception {
		mockMvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON).content(VALID))
				.andExpect(status().isAccepted())
				.andExpect(jsonPath("$.status").value("accepted"));

		ArgumentCaptor<ContactRequest> captor = ArgumentCaptor.forClass(ContactRequest.class);
		verify(service).submit(captor.capture());
		assertEquals("Test User", captor.getValue().name());
		assertEquals("visitor@example.com", captor.getValue().email());
		assertEquals("5551234567", captor.getValue().phone());
		assertEquals("Hello", captor.getValue().message());
	}

	@Test
	void postInvalidEmail_returns400WithFieldError() throws Exception {
		String bad = VALID.replace("visitor@example.com", "not-an-email");
		mockMvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON).content(bad))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.errors.email").exists());
	}

	@Test
	void postBlankName_returns400WithFieldError() throws Exception {
		String bad = VALID.replace("Test User", " ");
		mockMvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON).content(bad))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.errors.name").exists());
	}

	@Test
	void postOversizeMessage_returns400WithFieldError() throws Exception {
		String bad = VALID.replace("Hello", "x".repeat(5001));
		mockMvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON).content(bad))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.errors.message").exists());
	}

	@Test
	void postMalformedJson_returns400() throws Exception {
		mockMvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON).content("{ not valid json"))
				.andExpect(status().isBadRequest());
	}

	@Test
	void getOnEndpoint_returns405MethodNotAllowed() throws Exception {
		mockMvc.perform(get("/api/contact"))
				.andExpect(status().isMethodNotAllowed());
	}

}
