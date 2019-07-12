import {TestExecutionContext} from "@sakuli/core";
import {Logger} from "./logger.interface";

export function createLoggerObject(ctx: TestExecutionContext): Logger {
    return ({
        logError(message: string) {
            ctx.logger.error(message)
        },
        logWarning(message: string) {
            ctx.logger.warn(message);
        },
        logInfo(message: string) {
            ctx.logger.info(message);
        },
        logDebug(message: string) {
            ctx.logger.debug(message);
        }
    })
}