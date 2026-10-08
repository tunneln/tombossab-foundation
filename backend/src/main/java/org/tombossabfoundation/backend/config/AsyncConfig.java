package org.tombossabfoundation.backend.config;

import java.util.concurrent.Executor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@Configuration
@EnableAsync
public class AsyncConfig {

	private static final Logger log = LoggerFactory.getLogger(AsyncConfig.class);

	static final int SHUTDOWN_GRACE_SECONDS = 20;

	/**
	 * Dedicated executor for outbound mail so a slow SMTP server can't back up
	 * requests. Mail is best-effort: when the queue is full, the email is dropped
	 * and logged rather than throwing into the request (the default AbortPolicy
	 * would fail a submission that was already saved).
	 *
	 * On shutdown (e.g. a deploy) queued emails are still sent, for up to
	 * {@link #SHUTDOWN_GRACE_SECONDS}; deploy/docker-compose.yml gives the
	 * container longer than that to stop. Anything left after it is logged.
	 */
	@Bean(name = "mailExecutor")
	Executor mailExecutor() {
		ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
		executor.setCorePoolSize(1);
		executor.setMaxPoolSize(2);
		executor.setQueueCapacity(100);
		executor.setThreadNamePrefix("mail-");
		executor.setRejectedExecutionHandler((task, pool) -> log.error(pool.isShutdown()
				? "Mail executor shutting down; dropping a notification email"
				: "Mail queue full; dropping a notification email"));
		executor.setWaitForTasksToCompleteOnShutdown(true);
		executor.setAwaitTerminationSeconds(SHUTDOWN_GRACE_SECONDS);
		executor.initialize();
		return executor;
	}

}
