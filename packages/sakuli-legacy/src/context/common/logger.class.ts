import {TestExecutionContext} from "@sakuli/core";

export function createLoggerClass(ctx: TestExecutionContext) {
    return class Logger {
        static logError(message: string) {
            ctx.logger.error(message)
        }

        static logWarning(message: string) {
            ctx.logger.warn(message);
        }

        static logInfo(message: string) {
            ctx.logger.info(message);
        }

        static logDebug(message: string) {
            ctx.logger.debug(message);
        }
    }
}