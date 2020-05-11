import { renderError } from "./render-error.function";

describe("renderError", () => {
  it("should print error message and stack", async () => {
    const error = Error("Failing Test");
    jest.spyOn(console, "error");
    await renderError(error);
    expect(console.error).toHaveBeenCalledTimes(2);
    expect(console.error).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining("Failing Test")
    );
  });

  afterEach(() => jest.restoreAllMocks());
});
