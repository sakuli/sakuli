import { mockPartial } from "sneer";
import { Type } from "@sakuli/commons";
import { Project } from "@sakuli/core";
import { LegacyProjectProperties } from "../../loader/legacy-project-properties.class";
import { SeleniumProperties } from "./selenium-properties.class";
import { Browsers, createDriverFromProject, } from "./create-driver-from-project.function";
import { Builder } from "selenium-webdriver";
import { FirefoxProperties } from "./firefox-properties.class";
import { IeProperties } from "./ie-properties.class";
import { ChromeProperties } from "./chrome-properties.class";
import { applyBrowserOptions } from "./apply-browser-options.function";

jest.mock("./apply-browser-options.function", () => ({
  applyBrowserOptions: jest.fn(),
}));

describe("createDriverFromProject", () => {
  let project: Project;
  let builder: Builder;
  let legacyProps: LegacyProjectProperties;
  let seleniumProps: SeleniumProperties;
  let ffProps: FirefoxProperties;
  let ieProps: IeProperties;
  let chromeProps: ChromeProperties;

  beforeEach(() => {
    legacyProps = new LegacyProjectProperties();
    seleniumProps = new SeleniumProperties();
    ffProps = new FirefoxProperties();
    ieProps = new IeProperties();
    chromeProps = new ChromeProperties();

    project = mockPartial<Project>({
      objectFactory: jest.fn((type: Type<any>): any => {
        if (type === LegacyProjectProperties) return legacyProps;
        if (type === SeleniumProperties) return seleniumProps;
        if (type === IeProperties) return ieProps;
        if (type === ChromeProperties) return chromeProps;
        if (type === FirefoxProperties) return ffProps;

        throw Error(
          "unexpected property-class causes test to fail: " + type.name
        );
      }),
    });
    builder = mockPartial<Builder>({
      forBrowser: jest.fn(() => builder),
      withCapabilities: jest.fn(() => builder),
      build: jest.fn(),
      setFirefoxOptions: jest.fn(() => builder),
      setChromeOptions: jest.fn(() => builder),
    });
  });

  it("should read browser with getBrowser", () => {
    jest.spyOn(legacyProps, "getBrowser");
    createDriverFromProject(project, builder);
    expect(legacyProps.getBrowser).toHaveBeenCalled();
  });

  it.each(["chrome", "firefox", "ie", "edge"] as Browsers[])(
    `should in invoke the methods according to browser`,
    (browser: Browsers) => {
      legacyProps.browser = browser;
      createDriverFromProject(project, builder);
      expect(applyBrowserOptions).toHaveBeenCalledWith(
        browser,
        project,
        builder
      );
    }
  );
});
