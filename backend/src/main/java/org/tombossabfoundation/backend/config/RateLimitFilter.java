package org.tombossabfoundation.backend.config;

import io.github.bucket4j.Bucket;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.time.Duration;
import java.util.Collections;
import java.util.HexFormat;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.regex.Pattern;
import org.springframework.http.MediaType;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Per-client-IP token bucket over the public POST endpoints. In-memory is
 * deliberate: the API runs as a single instance; swap the map for a shared
 * store if that ever changes.
 */
public class RateLimitFilter extends OncePerRequestFilter {

	static final int MAX_TRACKED_CLIENTS = 10_000;

	/** An IPv6 literal's characters: hex digits, colons, dots (IPv4-mapped). */
	private static final Pattern IPV6_LITERAL = Pattern.compile("[0-9A-Fa-f:.]+");

	private final RateLimitProperties properties;

	/**
	 * Bounded LRU: past the cap, the least recently seen client is dropped, so
	 * memory stays fixed and every request is O(1) even under a flood of new
	 * addresses. (A dropped client just starts over with a full bucket.)
	 */
	private final Map<String, Bucket> buckets = Collections.synchronizedMap(
			new LinkedHashMap<>(256, 0.75f, true) {
				@Override
				protected boolean removeEldestEntry(Map.Entry<String, Bucket> eldest) {
					return size() > MAX_TRACKED_CLIENTS;
				}
			});

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
		Bucket bucket = buckets.computeIfAbsent(clientKey(clientIp(request)), ip -> newBucket());
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

	int trackedClients() {
		return buckets.size();
	}

	/**
	 * IPv6 clients are keyed by their /64 network: one subscriber usually gets a
	 * whole /64, so per-address buckets would let them rotate addresses for
	 * fresh limits. IPv4 (and anything unparseable) is keyed as-is.
	 */
	static String clientKey(String ip) {
		// Only IPv6 literals (hex digits, colons, dots) are parsed, so getByName
		// never does a DNS lookup on a header value.
		if (ip.indexOf(':') < 0 || !IPV6_LITERAL.matcher(ip).matches()) {
			return ip;
		}
		try {
			byte[] address = InetAddress.getByName(ip).getAddress();
			if (address.length != 16) {
				return ip;
			}
			return HexFormat.of().formatHex(address, 0, 8) + "::/64";
		} catch (UnknownHostException e) {
			return ip;
		}
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
