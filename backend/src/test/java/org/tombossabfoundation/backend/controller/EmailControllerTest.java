package org.tombossabfoundation.backend.controller;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.tombossabfoundation.backend.service.EmailService;

/**
 * Web-layer slice for the email API. EmailService is mocked, so nothing touches
 * SMTP — these tests pin the HTTP contract (routing, status codes, request-body
 * mapping) that the frontend's newsletter form in components/Footer.js depends on.
 */
@WebMvcTest(EmailController.class)
class EmailControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EmailService emailService;

    private static final String VALID_BODY =
            "{\"to\":\"dest@example.com\",\"subject\":\"Subj\",\"body\":\"Body text\"}";

    @Test
    void postValidRequest_returns200_withConfirmationText() throws Exception {
        mockMvc.perform(post("/api/emails/send")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(VALID_BODY))
                .andExpect(status().isOk())
                .andExpect(content().string("Email sent successfully"));
    }

    @Test
    void postValidRequest_delegatesToServiceWithMappedFields() throws Exception {
        mockMvc.perform(post("/api/emails/send")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(VALID_BODY))
                .andExpect(status().isOk());

        // The JSON body must be deserialized onto EmailRequest and forwarded verbatim.
        verify(emailService).sendSimpleEmail(eq("dest@example.com"), eq("Subj"), eq("Body text"));
    }

    @Test
    void postMalformedJson_returns400() throws Exception {
        mockMvc.perform(post("/api/emails/send")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{ not valid json"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getOnSendEndpoint_returns405_methodNotAllowed() throws Exception {
        mockMvc.perform(get("/api/emails/send"))
                .andExpect(status().isMethodNotAllowed());
    }
}
