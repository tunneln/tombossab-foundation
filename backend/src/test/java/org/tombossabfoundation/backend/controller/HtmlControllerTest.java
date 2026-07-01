package org.tombossabfoundation.backend.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.view;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Web-layer slice for the clean-URL mapping that lets the exported static site use
 * extensionless URLs ("/about" instead of "/about.html"). This behaviour is tied
 * to the current "backend serves the frontend" architecture; when the planned
 * refactor moves the frontend to its own host these mappings (and this test) retire
 * together.
 */
@WebMvcTest(HtmlController.class)
class HtmlControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void cleanUrl_forwardsToExportedHtmlView() throws Exception {
        mockMvc.perform(get("/about"))
                .andExpect(status().isOk())
                .andExpect(view().name("/about.html"));
    }

    @Test
    void nestedEventUrl_forwardsToExportedEventHtmlView() throws Exception {
        mockMvc.perform(get("/events/coffee-women-empowerment-1"))
                .andExpect(status().isOk())
                .andExpect(view().name("/events/coffee-women-empowerment-1.html"));
    }

    @Test
    void legacyCoffeeUrl_permanentlyRedirectsToEventPage() throws Exception {
        mockMvc.perform(get("/coffee-women-empowerment"))
                .andExpect(status().isMovedPermanently())
                .andExpect(redirectedUrl("/events/coffee-women-empowerment-1"));
    }

    @Test
    void legacyEventsDetailUrl_permanentlyRedirectsToEventPage() throws Exception {
        mockMvc.perform(get("/events-detail"))
                .andExpect(status().isMovedPermanently())
                .andExpect(redirectedUrl("/events/coffee-women-empowerment-1"));
    }

    @Test
    void pathWithDotExtension_isNotRewrittenAsCleanUrl() throws Exception {
        // The {page} regex explicitly excludes any path containing a dot, so real
        // static files (e.g. styles.css) fall through to the resource handler
        // rather than being rewritten to "styles.css.html". In this web-layer
        // slice there is no matching resource, so the request is simply unmatched
        // (404) — the point is that HtmlController does NOT claim it.
        mockMvc.perform(get("/styles.css"))
                .andExpect(status().isNotFound());
    }
}
