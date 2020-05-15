import { timeout } from "./poll-action.function";

describe("poll-action", () => {
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
      expect(e).toBe(`Action timed out after ${maxDuration}`);
    }
    const end = Date.now();

    // THEN
    expect(end - start).toBeGreaterThanOrEqual(maxDuration);
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
      expect(e).toBe(`Action timed out after ${maxDuration}`);
    }
    const end = Date.now();

    // THEN
    expect(end - start).toBeGreaterThanOrEqual(maxDuration);
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
    expect(end - start).toBeGreaterThanOrEqual(delay);
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
      expect(e).toBe(`Action timed out after ${maxDuration}`);
    }
    const end = Date.now();

    // THEN
    expect(action).toBeCalledTimes(1);
    expect(end - start).toBeLessThan(updateInterval);
  });
});
