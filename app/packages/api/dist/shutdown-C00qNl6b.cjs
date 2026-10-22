let _librechat_data_schemas = require("@librechat/data-schemas");
//#region src/app/shutdown.ts
const SHUTDOWN_TIMEOUT_MS = 6e4;
const SIGNALS = [
	"SIGTERM",
	"SIGINT",
	"SIGQUIT",
	"SIGHUP"
];
const tasks = [];
let isShuttingDown = false;
let httpServer = null;
/**
* Register a cleanup task to run after the HTTP server has closed.
* Tasks run in registration order; if one throws, subsequent tasks
* and the final exit are not blocked. Use this instead of attaching
* `process.on('SIGTERM', ...)` handlers directly — multiple competing
* signal handlers race with the HTTP drain because Node dispatches
* listeners in registration order and any one of them can call
* `process.exit` before the HTTP server has finished closing.
*/
function registerShutdownTask(name, fn) {
	tasks.push({
		name,
		fn
	});
}
/**
* Wires SIGTERM, SIGINT, SIGQUIT, and SIGHUP to a graceful shutdown
* sequence: close the HTTP server (stop accepting new connections, let
* in-flight requests finish), run any tasks registered via
* `registerShutdownTask`, then `process.exit(0)`. After
* SHUTDOWN_TIMEOUT_MS the process is force-exited with code 1 — a
* safety net for long-lived connections such as SSE streams that may
* not finish in time.
*/
function setupGracefulShutdown(server) {
	httpServer = server;
	for (const signal of SIGNALS) process.on(signal, () => {
		shutdown(signal);
	});
}
/**
* @internal Reset module state for tests. Not part of the public API.
*/
function __resetShutdownStateForTests() {
	tasks.length = 0;
	isShuttingDown = false;
	httpServer = null;
}
async function shutdown(signal) {
	if (isShuttingDown) return;
	isShuttingDown = true;
	_librechat_data_schemas.logger.info(`Received ${signal}, draining HTTP server...`);
	const forceExit = setTimeout(() => {
		_librechat_data_schemas.logger.warn(`Graceful shutdown exceeded ${SHUTDOWN_TIMEOUT_MS}ms, forcing exit`);
		process.exit(1);
	}, SHUTDOWN_TIMEOUT_MS);
	forceExit.unref();
	let exitCode = 0;
	try {
		await closeHttpServer();
	} catch (err) {
		_librechat_data_schemas.logger.error("Error closing HTTP server during graceful shutdown:", err);
		exitCode = 1;
	}
	for (const task of tasks) try {
		_librechat_data_schemas.logger.info(`Running shutdown task: ${task.name}`);
		await task.fn();
	} catch (err) {
		_librechat_data_schemas.logger.error(`Shutdown task "${task.name}" failed:`, err);
	}
	clearTimeout(forceExit);
	_librechat_data_schemas.logger.info("Graceful shutdown complete, exiting");
	process.exit(exitCode);
}
function closeHttpServer() {
	return new Promise((resolve, reject) => {
		if (!httpServer || !httpServer.listening) {
			resolve();
			return;
		}
		httpServer.close((err) => {
			if (!err || err.code === "ERR_SERVER_NOT_RUNNING") {
				resolve();
				return;
			}
			reject(err);
		});
	});
}
//#endregion
Object.defineProperty(exports, "__resetShutdownStateForTests", {
	enumerable: true,
	get: function() {
		return __resetShutdownStateForTests;
	}
});
Object.defineProperty(exports, "registerShutdownTask", {
	enumerable: true,
	get: function() {
		return registerShutdownTask;
	}
});
Object.defineProperty(exports, "setupGracefulShutdown", {
	enumerable: true,
	get: function() {
		return setupGracefulShutdown;
	}
});

//# sourceMappingURL=shutdown-C00qNl6b.cjs.map