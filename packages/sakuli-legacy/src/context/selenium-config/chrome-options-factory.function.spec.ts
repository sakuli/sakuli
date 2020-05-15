import { chromeOptionsFactory } from "./chrome-options-factory.function";
import { ChromeProperties } from "./chrome-properties.class";

jest.mock("selenium-webdriver/chrome", () => ({
  Options: jest.fn().mockImplementation(() => ({
    setChromeBinaryPath: jest.fn(),
    addArguments: jest.fn(),
    headless: jest.fn(),
    windowSize: jest.fn(),
    excludeSwitches: jest.fn(),
    addExtensions: jest.fn(),
    detachDriver: jest.fn(),
  })),
}));

describe("applyChromeOptions", () => {
  let props: ChromeProperties;
  beforeEach(() => {
    props = new ChromeProperties();
  });

  it("should set simple string values", () => {
    // GIVEN
    props.binaryPath = "path/to/chrome";
    props.headless = true;

    // WHEN
    const opts = chromeOptionsFactory(props);

    // THEN
    expect(opts.setChromeBinaryPath).toHaveBeenCalledWith("path/to/chrome");
    expect(opts.headless).toHaveBeenCalled();
  });

  it("should spread array values", () => {
    props.arguments = ["--arg1", "arg2", "--arg3=foo", "arg4=bar"];
    props.excludeSwitches = ["a", "b", "c"];
    props.extensions = ["ext1", "ext2"];

    const opts = chromeOptionsFactory(props);

    expect(opts.addArguments).toHaveBeenCalledWith(
      "--arg1",
      "arg2",
      "--arg3=foo",
      "arg4=bar"
    );
    expect(opts.excludeSwitches).toHaveBeenCalledWith("a", "b", "c");
    expect(opts.addExtensions).toHaveBeenCalledWith("ext1", "ext2");
  });

  it("should set size when width and height are set", () => {
    props.windowSizeHeight = 800;
    props.windowSizeWidth = 600;

    const opts = chromeOptionsFactory(props);

    expect(opts.windowSize).toHaveBeenCalledWith(
      expect.objectContaining({
        width: 600,
        height: 800,
      })
    );
  });

  it("should not not set size when only width is applied", () => {
    props.windowSizeWidth = 800;

    const opts = chromeOptionsFactory(props);

    expect(opts.windowSize).toHaveBeenCalledTimes(0);
  });

  it("should not not set size when only height is applied", () => {
    props.windowSizeHeight = 800;

    const opts = chromeOptionsFactory(props);

    expect(opts.windowSize).toHaveBeenCalledTimes(0);
  });
});
