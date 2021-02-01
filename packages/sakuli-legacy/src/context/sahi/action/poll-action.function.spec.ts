import { timeout } from "./poll-action.function";

describe("poll-action", () => {
  function applyTimerBuffer(time: number) {
    // Added buffer to timer accuracy as `The callback will be called as close as possible to the time specified.`
    // https://nodejs.org/api/timers.html#timers_settimeout_callback_delay_args
    return time * 0.99;
  }

  it("should timeout after maxDuration if action rejects", async () => {
    // GIVEN
    const updateInterval = 200;
    const maxDuration = 1000;
    const action = jest.fn(() => {
      console.log(`Polling...`);
      return Promise.reject(false);
    });

    // WHEN
    const start = Date.now();
    try {
      await timeout(updateInterval, maxDuration, action);
    } catch (e) {
      expect(e).toBe(`Action timed out after ${maxDuration} ms`);
    }
    const end = Date.now();

    // THEN
    expect(end - start).toBeGreaterThanOrEqual(applyTimerBuffer(maxDuration));
    expect(action).toBeCalledTimes(maxDuration / updateInterval);
  });

  it("should timeout after maxDuration if action resolve != true", async () => {
    // GIVEN
    const updateInterval = 200;
    const maxDuration = 1000;
    const action = jest.fn(async () => {
      console.log(`Polling...`);
      return false;
    });

    // WHEN
    const start = Date.now();
    try {
      await timeout(updateInterval, maxDuration, action);
    } catch (e) {
      expect(e).toBe(`Action timed out after ${maxDuration} ms`);
    }
    const end = Date.now();

    // THEN
    expect(end - start).toBeGreaterThanOrEqual(applyTimerBuffer(maxDuration));
    expect(action).toBeCalledTimes(maxDuration / updateInterval);
  });

  it("should resolve after updateInterval if action resolves", async () => {
    // GIVEN
    const updateInterval = 200;
    const maxDuration = 1000;
    const action = jest.fn(() => {
      console.log(`Polling...`);
      return Promise.resolve(true);
    });

    // WHEN
    const start = Date.now();
    await timeout(updateInterval, maxDuration, action);
    const end = Date.now();

    // THEN
    expect(end - start).toBeLessThan(updateInterval);
    expect(action).toBeCalledTimes(1);
  });

  it("should resolve after updateInterval if action resolves != true", async () => {
    // GIVEN
    const updateInterval = 200;
    const maxDuration = 1000;
    const action = jest.fn(async () => {
      console.log(`Polling...`);
      return true;
    });

    // WHEN
    const start = Date.now();
    await timeout(updateInterval, maxDuration, action);
    const end = Date.now();

    // THEN
    expect(end - start).toBeLessThan(updateInterval);
    expect(action).toBeCalledTimes(1);
  });

  it("should retry until action succeeds", async () => {
    // GIVEN
    const updateInterval = 200;
    const maxDuration = 1000;
    const delay = 2.2 * updateInterval;
    const action = jest.fn(() => {
      console.log(`Polling...`);
      const interval = Date.now() - start;
      return new Promise<boolean>((resolve, reject) =>
        interval > delay ? resolve(true) : reject()
      );
    });

    // WHEN
    const start = Date.now();
    await timeout(updateInterval, maxDuration, action);
    const end = Date.now();

    // THEN
    expect(end - start).toBeGreaterThanOrEqual(applyTimerBuffer(delay));
    expect(action).toBeCalledTimes(4);
  });

  it("should fail after timeout if timeout < retry interval", async () => {
    // GIVEN
    const updateInterval = 1000;
    const maxDuration = 200;
    const action = jest.fn(() => Promise.resolve(false));

    // WHEN
    const start = Date.now();
    try {
      await timeout(updateInterval, maxDuration, action);
    } catch (e) {
      expect(e).toBe(`Action timed out after ${maxDuration} ms`);
    }
    const end = Date.now();

    // THEN
    expect(action).toBeCalledTimes(1);
    expect(end - start).toBeLessThan(updateInterval);
  });

  it("should fail after timeout if no result is returned from long running action", async (done) => {
    // GIVEN
    const updateInterval = 100;
    const maxDuration = 200;
    const action = jest.fn(() => {
      return new Promise<boolean>((resolve) => {
        setTimeout(() => {
          resolve((undefined as unknown) as boolean);
        }, 210);
      });
    });

    // WHEN
    try {
      await timeout(updateInterval, maxDuration, action);
    } catch (e) {
      expect(e).toBe(`Action timed out after ${maxDuration} ms`);
    }

    // THEN
    expect(action).toBeCalledTimes(1);
    setTimeout(() => {
      expect(action).toBeCalledTimes(1);
      done();
    }, 500);
  });
});
