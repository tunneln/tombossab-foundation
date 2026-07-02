package org.tombossabfoundation.backend.engagement.subscription;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.tombossabfoundation.backend.config.SecurityConfig;

@WebMvcTest(SubscriptionController.class)
@Import(SecurityConfig.class)
class SubscriptionControllerTest {

	private static final String BODY = """
			{"email":"reader@example.com"}""";

	@Autowired
	private MockMvc mockMvc;

	@MockitoBean
	private SubscriptionService service;

	@Test
	void newSubscriber_returns201() throws Exception {
		when(service.subscribe(any())).thenReturn(true);
		mockMvc.perform(post("/api/subscriptions").contentType(MediaType.APPLICATION_JSON).content(BODY))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.status").value("subscribed"));
	}

	@Test
	void existingSubscriber_isIdempotent200() throws Exception {
		when(service.subscribe(any())).thenReturn(false);
		mockMvc.perform(post("/api/subscriptions").contentType(MediaType.APPLICATION_JSON).content(BODY))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status").value("subscribed"));
	}

	@Test
	void invalidEmail_returns400() throws Exception {
		mockMvc.perform(post("/api/subscriptions").contentType(MediaType.APPLICATION_JSON)
				.content("""
						{"email":"nope"}"""))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.errors.email").exists());
	}

}
