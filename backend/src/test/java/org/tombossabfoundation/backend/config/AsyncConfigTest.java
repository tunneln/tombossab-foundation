package org.tombossabfoundation.backend.config;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executor;
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

}
