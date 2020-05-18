import { WebDriver } from "selenium-webdriver";
import { TestExecutionContext } from "@sakuli/core";

export async function fetchPageSource(
  webDriver: WebDriver,
  ctx: TestExecutionContext
) {
  const start = Date.now();
  ctx.logger.trace(`Fetching page source`);
  const pageSource = await webDriver.getPageSource();
  ctx.logger.trace(`Fetched page source in ${Date.now() - start} ms`);
  return pageSource;
}
