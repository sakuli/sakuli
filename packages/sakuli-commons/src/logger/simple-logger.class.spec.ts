import {SimpleLogger} from "./simple-logger.class";
import {LogLevel} from "./log-level.class";

describe("SimpleLogger", () => {
    it("should log on info level by default", () => {
        // GIVEN
        const SUT = new SimpleLogger();
        const consumerMock = jest.fn();
        SUT.onEvent(consumerMock);
        const payload = "log message";

        // WHEN
        SUT.debug(payload);
        SUT.info(payload);
        SUT.warn(payload);
        SUT.error(payload);

        // THEN
        expect(consumerMock).toBeCalledTimes(3);
        [LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR].map(level =>
            expect(consumerMock).toBeCalledWith(
                expect.objectContaining({
                    level: level,
                    message: payload
                })
            ));
    });

    it.each([
        [4, LogLevel.DEBUG],
        [3, LogLevel.INFO],
        [2, LogLevel.WARN],
        [1, LogLevel.ERROR],
    ])("should log %i times on level %s", (times: number, level: LogLevel) => {
        // GIVEN
        const SUT = new SimpleLogger();
        const consumerMock = jest.fn();
        SUT.onEvent(consumerMock);
        SUT.logLevel = level;
        const payload = "log message";

        // WHEN
        SUT.debug(payload);
        SUT.info(payload);
        SUT.warn(payload);
        SUT.error(payload);

        // THEN
        expect(consumerMock).toBeCalledTimes(times);
        for (let idx = level; idx <= LogLevel.ERROR; ++idx) {
            expect(consumerMock).toBeCalledWith(
                expect.objectContaining({
                    level: idx,
                    message: payload
                })
            );
        }
    });
});