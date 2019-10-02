import { SimpleLogger, createCombinedLogConsumer, createFileLogConsumer } from "@sakuli/commons";

export function createLogConsumer(logger: SimpleLogger, path: string) {
    const logConsumer = createCombinedLogConsumer(
        createFileLogConsumer({path})
    );
    return logConsumer(logger);
}
