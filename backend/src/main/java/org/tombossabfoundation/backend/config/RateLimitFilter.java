package org.tombossabfoundation.backend.config;

import io.github.bucket4j.Bucket;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.http.MediaType;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Per-client-IP token bucket over the public POST endpoints. In-memory is
 * deliberate: the API runs as a single instance; swap the map for a shared
 * store if that ever changes.
 */
public class RateLimitFilter extends OncePerRequestFilter {

	private static final int MAX_TRACKED_CLIENTS = 10_000;

	private final RateLimitProperties properties;
	private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

	public RateLimitFilter(RateLimitProperties properties) {
		this.properties = properties;
	}

	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) {
		return !("POST".equals(request.getMethod()) && request.getRequestURI().startsWith("/api/"));
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
			throws ServletException, IOException {
		if (buckets.size() > MAX_TRACKED_CLIENTS) {
			buckets.clear();
		}
		Bucket bucket = buckets.computeIfAbsent(clientIp(request), ip -> newBucket());
		if (bucket.tryConsume(1)) {
			chain.doFilter(request, response);
			return;
		}
		response.setStatus(429);
		response.setContentType(MediaType.APPLICATION_PROBLEM_JSON_VALUE);
		response.getWriter().write("""
				{"type":"about:blank","title":"Too Many Requests","status":429,\
				"detail":"Rate limit exceeded; please try again in a minute."}""");
	}

	private Bucket newBucket() {
		return Bucket.builder()
				.addLimit(limit -> limit.capacity(properties.capacity())
						.refillGreedy(properties.capacity(), Duration.ofMinutes(properties.refillMinutes())))
				.build();
	}

	/** Caddy fronts the app in production and sets X-Forwarded-For. */
	private String clientIp(HttpServletRequest request) {
		String forwarded = request.getHeader("X-Forwarded-For");
		if (forwarded != null && !forwarded.isBlank()) {
			return forwarded.split(",")[0].trim();
		}
		return request.getRemoteAddr();
	}

}
