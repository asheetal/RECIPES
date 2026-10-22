import { rn as ServerRequest } from "./index-D9XDH6QQ.cjs";
import { NextFunction, Response } from "express";
//#region src/telemetry/config.d.ts
type TelemetryStatus = "disabled" | "failed" | "started" | "starting" | "stopped";
interface TelemetryConfig {
  enabled: boolean;
  healthPath: string;
  ioredisTracingEnabled: boolean;
  sdkDisabled: boolean;
  serviceName: string;
  serviceVersion?: string;
}
declare function getTelemetryConfig(env?: NodeJS.ProcessEnv): TelemetryConfig;
//#endregion
//#region src/telemetry/sdk.d.ts
interface TelemetryController {
  readonly enabled: boolean;
  readonly status: TelemetryStatus;
  shutdown: () => Promise<void>;
}
declare function initializeTelemetry(env?: NodeJS.ProcessEnv): TelemetryController;
declare function shutdownTelemetry(): Promise<void>;
//#endregion
//#region src/telemetry/middleware.d.ts
type ExpressErrorValue = Error | string | number | boolean | bigint | symbol | object | null | undefined;
declare function telemetryMiddleware(req: ServerRequest, res: Response, next: NextFunction): void;
declare function telemetryErrorMiddleware(err: ExpressErrorValue, req: ServerRequest, _res: Response, next: NextFunction): void;
//#endregion
//#region src/telemetry/stream.d.ts
interface SseStreamTelemetry {
  recordHeadersFlushed: () => void;
  recordWrite: (payload: string, options?: {
    final?: boolean;
  }) => void;
  recordFinalEventEmitted: () => void;
  recordErrorEventEmitted: () => void;
  recordSubscribeFailed: () => void;
}
interface SseStreamTelemetryOptions {
  isResume: boolean;
  req: ServerRequest;
  res: Response;
  streamId: string;
}
declare function createSseStreamTelemetry(options: SseStreamTelemetryOptions): SseStreamTelemetry;
//#endregion
export { type SseStreamTelemetry, type TelemetryConfig, type TelemetryController, type TelemetryStatus, createSseStreamTelemetry, getTelemetryConfig, initializeTelemetry, shutdownTelemetry, telemetryErrorMiddleware, telemetryMiddleware };
//# sourceMappingURL=telemetry.d.cts.map