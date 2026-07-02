package org.tombossabfoundation.backend.content.event;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.tombossabfoundation.backend.config.SecurityConfig;

@WebMvcTest(EventController.class)
@Import(SecurityConfig.class)
class EventControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockitoBean
	private EventService service;

	@Test
	void get_returnsEvents_slugMayBeNull_dateIsIso() throws Exception {
		when(service.findAll()).thenReturn(List.of(
				new EventResponse("coffee-women-empowerment-1", "Coffee & Women Empowerment",
						LocalDate.of(2026, 6, 27), "2:00pm to 6:00pm", "7522 Overdale Dr.", "Dallas, TX",
						"/images/coffee-women-empowerment.jpg", "Coffee & Women Empowerment"),
				new EventResponse(null, "Memorial of Tombossa Negusse | Foundation Inauguration",
						LocalDate.of(2024, 11, 30), "11:00am to 2:00pm", "High Point Center", "Dallas, TX",
						"/images/img7.jpg", "")));

		mockMvc.perform(get("/api/events"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].slug").value("coffee-women-empowerment-1"))
				.andExpect(jsonPath("$[0].eventDate").value("2026-06-27"))
				.andExpect(jsonPath("$[1].slug").isEmpty())
				.andExpect(jsonPath("$[1].timeLabel").value("11:00am to 2:00pm"));
	}

}
