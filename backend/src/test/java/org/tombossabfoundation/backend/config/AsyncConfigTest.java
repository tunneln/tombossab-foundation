package org.tombossabfoundation.backend.config;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executor;
import java.util.concurrent.atomic.AtomicInteger;
import org.junit.jupiter.api.Test;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

class AsyncConfigTest {

	@Test
	void fullMailQueue_dropsTheEmail_insteadOfFailingTheRequest() {
		Executor executor = new AsyncConfig().mailExecutor();
		CountDownLatch stalledSmtp = new CountDownLatch(1);
		try {
			// 2 busy threads + 100 queued: every task after that is rejected.
			for (int i = 0; i < 102; i++) {
				executor.execute(() -> {
					try {
						stalledSmtp.await();
					} catch (InterruptedException e) {
						Thread.currentThread().interrupt();
					}
				});
			}
			assertDoesNotThrow(() -> executor.execute(() -> { }));
		} finally {
			stalledSmtp.countDown();
			((ThreadPoolTaskExecutor) executor).shutdown();
		}
	}

	@Test
	void queuedEmails_stillGoOut_whenTheAppShutsDown() {
		ThreadPoolTaskExecutor executor = (ThreadPoolTaskExecutor) new AsyncConfig().mailExecutor();
		AtomicInteger sent = new AtomicInteger();
		for (int i = 0; i < 10; i++) {
			executor.execute(() -> {
				try {
					Thread.sleep(50); // a slow-ish SMTP send
				} catch (InterruptedException e) {
					Thread.currentThread().interrupt();
				}
				sent.incrementAndGet();
			});
		}
		executor.shutdown(); // waits for the queue (up to the grace period) instead of discarding it
		assertEquals(10, sent.get());
	}

}
