import { TestExecutionContext } from "@sakuli/core/dist";
import { SimpleLogger } from "@sakuli/commons/dist";
import { renderErrorsFromContext } from "./render-errors-from-context.function";
import { renderError } from "./render-error.function";

jest.mock("./render-error.function", () => ({
  renderError: jest.fn(),
}));

describe("renderErrorsFromContext", () => {
  it("should render all errors", async () => {
    const error1 = Error("error1");
    const error2 = Error("error1");

    const tec = new TestExecutionContext(new SimpleLogger());
    tec.startExecution();

    tec.startTestSuite();
    tec.startTestCase({ id: "FailingTC" });
    tec.updateCurrentTestCase({ error: error1 });
    tec.endTestCase();
    tec.endTestSuite();

    tec.startTestSuite();
    tec.startTestCase();
    tec.startTestStep({ id: "FailingStep" });
    tec.updateCurrentTestStep({ error: error2 });
    tec.endTestStep();
    tec.endTestCase();
    tec.endTestSuite();

    tec.endExecution();

    jest.spyOn(console, "log");

    await renderErrorsFromContext(tec);
    expect(console.log).toHaveBeenCalledTimes(2);
    expect(renderError).toHaveBeenCalledTimes(2);
    expect(console.log).toHaveBeenNthCalledWith(
      1,
      expect.stringMatching(/.*case.*FailingTC.*/gm)
    );
    expect(renderError).toHaveBeenNthCalledWith(1, error1);
    expect(console.log).toHaveBeenNthCalledWith(
      2,
      expect.stringMatching(/.*step.*FailingStep.*/gm)
    );
    expect(renderError).toHaveBeenNthCalledWith(2, error2);
  });
});
