import { ThenableWebDriver, WebElement } from "selenium-webdriver";
import { AccessorUtil } from "../../accessor";
import {
  isSahiElementQuery,
  SahiElementQueryOrWebElement,
  sahiQueryToString,
} from "../../sahi-element.interface";
import { timeout } from "../poll-action.function";
import { INJECT_SAKULI_HOOK } from "../inject.const";
import { TestExecutionContext } from "@sakuli/core";
import { CommonActionsApi } from "./common-actions.interface";
import { highlightElement, scrollIntoViewIfNeeded } from "../utils";
import { wait } from "../../helper/wait.function";
import { fetchPageSource } from "../utils/fetch-page-source.function";

export function commonActionsApi(
  webDriver: ThenableWebDriver,
  accessorUtil: AccessorUtil,
  ctx: TestExecutionContext
): CommonActionsApi {
  async function _eval<T = any>(source: string, ..._args: any[]): Promise<T> {
    const args = await Promise.all(
      _args.map((arg) => {
        if (isSahiElementQuery(arg)) {
          return accessorUtil.fetchElement(arg);
        } else {
          return Promise.resolve(arg);
        }
      })
    );
    return await webDriver.executeAsyncScript<T>(
      `
            var __done__ = arguments[arguments.length - 1];
            var result = (function(arguments) {
                ${source}
            })(arguments)
            __done__(result);
        `,
      ...args
    );
  }

  async function _highlight(
    query: SahiElementQueryOrWebElement | WebElement,
    timeoutMs: number = 2000
  ): Promise<void> {
    const element = isSahiElementQuery(query)
      ? await accessorUtil.fetchElement(query)
      : query;

    await scrollIntoViewIfNeeded(element, ctx);
    await highlightElement(element, timeoutMs);
  }

  async function _wait(
    millis: number,
    expression?: (
      ...locators: SahiElementQueryOrWebElement[]
    ) => Promise<boolean>
  ): Promise<void> {
    if (!expression) {
      return new Promise<void>((res) => {
        setTimeout(() => res(), millis);
      });
    }
    await timeout(200, millis, expression);
  }

  async function _navigateTo(
    target: string,
    forceReload: boolean = false,
    credentials?: { user: string; password: string }
  ): Promise<any> {
    const url = new URL(target);
    if (credentials) {
      url.username = credentials.user;
      url.password = credentials.password;
    }
    await webDriver.get(url.href);
    if (forceReload) {
      await webDriver.navigate().refresh();
    }
    try {
      await webDriver.executeScript(INJECT_SAKULI_HOOK);
    } catch (e) {
      // ignore
    }
  }

  async function _pageIsStable(
    maxDuration: number = 2_000,
    interval: number = 200
  ): Promise<boolean> {
    ctx.logger.debug("Waiting for DOM to stabilize");
    const start = Date.now();
    async function compareDom(): Promise<boolean> {
      const oldDom = await fetchPageSource(webDriver, ctx);
      await wait(interval);
      const newDom = await fetchPageSource(webDriver, ctx);
      const result = oldDom === newDom;
      ctx.logger.trace(`DOM is stable? ${result}`);
      return result;
    }

    try {
      await timeout(interval, maxDuration, () => compareDom());
      ctx.logger.debug(`DOM stabilized after ${Date.now() - start} ms`);
      return true;
    } catch (e) {
      ctx.logger.debug(`DOM still unstable after ${Date.now() - start} ms`);
      return false;
    }
  }

  async function _rteWrite(
    query: SahiElementQueryOrWebElement,
    content: string
  ): Promise<void> {
    const e = await accessorUtil.fetchElement(query);
    const tagName = await e.getTagName();
    if (tagName.toLocaleLowerCase() !== "iframe") {
      if (isSahiElementQuery(query)) {
        throw Error(
          `Query ${sahiQueryToString(
            query
          )} must find an iframe; got ${tagName} instead`
        );
      } else {
        throw Error(`WebElement must be an iframe; got ${tagName} instead`);
      }
    }
    const defaultWindowHandle = await webDriver.getWindowHandle();
    await webDriver.switchTo().frame(e);
    await webDriver.executeScript(
      `
            document.body.innerHTML = arguments[0];
        `,
      content
    );
    await webDriver.switchTo().window(defaultWindowHandle);
  }

  return {
    _wait,
    _highlight,
    _navigateTo,
    _rteWrite,
    _eval,
    _pageIsStable,
  };
}
