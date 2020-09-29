import { createCiLogConsumer } from "./create-ci-log-consumer.function";
import { SimpleLogger } from "../simple-logger.class";
import {mockPartial} from "sneer";

describe("create-ci-log-consumer", () => {
    it("should subscribe ci logger on log events", () => {

    //GIVEN
    const logger = mockPartial<SimpleLogger>({
      onEvent: jest.fn()
    });
    const logConsumer = createCiLogConsumer();

    //WHEN
    logConsumer(logger);

    //THEN
    expect(logger.onEvent).toHaveBeenCalled();

  });
});
