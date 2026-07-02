package org.tombossabfoundation.backend;

import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.PostgreSQLContainer;

/**
 * Singleton Postgres for all integration tests (*IT): started once per JVM,
 * shared across classes, cleaned up by Testcontainers' reaper. Requires Docker.
 */
public abstract class AbstractPostgresIT {

	@ServiceConnection
	protected static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16-alpine");

	static {
		POSTGRES.start();
	}

}
