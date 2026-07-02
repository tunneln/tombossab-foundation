package org.tombossabfoundation.backend.config;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

class RateLimitFilterTest {

	private static MockHttpServletRequest post(String ip) {
		MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/contact");
		request.setRemoteAddr(ip);
		return request;
	}

	@Test
	void postsBeyondCapacity_get429() throws Exception {
		RateLimitFilter filter = new RateLimitFilter(new RateLimitProperties(2, 1));
		for (int i = 0; i < 2; i++) {
			MockHttpServletResponse response = new MockHttpServletResponse();
			filter.doFilter(post("10.0.0.1"), response, new MockFilterChain());
			assertEquals(200, response.getStatus());
		}
		MockHttpServletResponse limited = new MockHttpServletResponse();
		filter.doFilter(post("10.0.0.1"), limited, new MockFilterChain());
		assertEquals(429, limited.getStatus());
		assertTrue(limited.getContentAsString().contains("Too Many Requests"));
	}

	@Test
	void distinctClients_haveIndependentBuckets() throws Exception {
		RateLimitFilter filter = new RateLimitFilter(new RateLimitProperties(1, 1));
		MockHttpServletResponse first = new MockHttpServletResponse();
		filter.doFilter(post("10.0.0.1"), first, new MockFilterChain());
		assertEquals(200, first.getStatus());

		MockHttpServletResponse other = new MockHttpServletResponse();
		filter.doFilter(post("10.0.0.2"), other, new MockFilterChain());
		assertEquals(200, other.getStatus());
	}

	@Test
	void forwardedForHeader_identifiesTheClientBehindCaddy() throws Exception {
		RateLimitFilter filter = new RateLimitFilter(new RateLimitProperties(1, 1));
		MockHttpServletRequest request = post("172.18.0.2");
		request.addHeader("X-Forwarded-For", "203.0.113.9, 172.18.0.2");
		filter.doFilter(request, new MockHttpServletResponse(), new MockFilterChain());

		// Same forwarded client from a different proxy hop is still rate-limited.
		MockHttpServletRequest again = post("172.18.0.3");
		again.addHeader("X-Forwarded-For", "203.0.113.9");
		MockHttpServletResponse limited = new MockHttpServletResponse();
		filter.doFilter(again, limited, new MockFilterChain());
		assertEquals(429, limited.getStatus());
	}

	@Test
	void nonPostAndNonApiRequests_areNotFiltered() {
		RateLimitFilter filter = new RateLimitFilter(new RateLimitProperties(1, 1));
		assertTrue(filter.shouldNotFilter(new MockHttpServletRequest("GET", "/api/recipients")));
		assertTrue(filter.shouldNotFilter(new MockHttpServletRequest("POST", "/actuator/health")));
	}

}
