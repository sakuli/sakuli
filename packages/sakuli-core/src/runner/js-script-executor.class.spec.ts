import { JsScriptExecutor } from "./js-script-executor.class";
import { stripIndents } from "common-tags";

describe("JsScriptExecutor", () => {
  it("should execute simple js code", async (done) => {
    const executor = new JsScriptExecutor({});

    await executor.execute(
      `
            const x = 1 + 1;
        `,
      {}
    );
    done();
  });

  it("should invoke functions from context", async (done) => {
    const executor = new JsScriptExecutor({ filename: "testfile.js" });
    const context = {
      getGreeting: jest.fn(),
    };
    await executor.execute(
      `
            const greeting = getGreeting('Tim')
        `,
      context
    );

    expect(context.getGreeting).toHaveBeenLastCalledWith("Tim");
    done();
  });

  it("should change context variables", async (done) => {
    const executor = new JsScriptExecutor({
      filename: "testfile.js",
    });
    const context = {
      x: 0,
    };
    const ctx = await executor.execute(
      `
            x = 1 + 1
        `,
      context
    );

    expect(ctx.x).toBe(2);
    done();
  });

  it("should allow multiple context executions", async () => {
    const executor = new JsScriptExecutor({ filename: "testfile.js" });
    const context = {
      x: 1,
    };
    const _ctxX2 = await executor.execute(`x += 1`, context);
    expect(_ctxX2.x).toBe(2);
    const _ctxX3 = await executor.execute(`x += 1`, _ctxX2);
    expect(_ctxX3.x).toBe(3);
  });

  it("should wait until async operations are done - by invoke done", async () => {
    const executor = new JsScriptExecutor({
      filename: "testfile.js",
    });
    const context = {
      x: 1,
      sayHello: jest.fn(),
      setTimeout,
    };
    const _ctxX = await executor.execute(
      stripIndents`
            async function wait(ms) {
                return new Promise((res, rej) => {
                    setTimeout(res, ms);
                })
            }
           (async () => {
                await wait(5);
                x = 5;
                sayHello();
            })().then(done);
        `,
      context
    );
    expect(context.sayHello).toHaveBeenCalled();
    expect(_ctxX.x).toBe(5);
  });

  it("should wait until async operations are done - by handle promise result", async () => {
    const executor = new JsScriptExecutor({
      filename: "test.js",
    });

    const context = {
      mock: jest.fn(),
    };

    await executor.execute(
      stripIndents`
            (async () => {
                mock()
            })()
        `,
      context
    );

    expect(context.mock).toHaveBeenCalled();
  });

  it("should wait until async operations are done - by handle result", async () => {
    const executor = new JsScriptExecutor({
      filename: "test.js",
    });

    const context = {
      mock: jest.fn(),
      test: (desc: string, cb: () => Promise<void>): Promise<void> => {
        return new Promise((res) => cb().then(res));
      },
    };

    await executor.execute(
      stripIndents`
            test('run somthing', async () => {
                mock();
            })
        `,
      context
    );

    expect(context.mock).toHaveBeenCalled();
  });

  it("should catch rejected promise when function is not defined", async () => {
    //GIVEN
    const executor = new JsScriptExecutor({
      filename: "test.js",
    });

    //WHEN
    const result = executor.execute(
      stripIndents`
        (async () => {
             moc()
        })()
        `,
      {}
    );

    //THEN
    await expect(result).rejects.toThrowError("moc is not defined");
  });
});
