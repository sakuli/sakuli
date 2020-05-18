import { Maybe, Property } from "@sakuli/commons";
import { ProxyConfig } from "selenium-webdriver";

export class EdgeProperties {
  /**
   * Sets the proxy settings for the new session.
   */
  @Property("selenium.edge.proxy")
  proxy: Maybe<ProxyConfig>;

  /**
   * Sets the page load strategy for Edge.
   * Supported values are 'normal', 'eager', and 'none';
   */
  @Property("selenium.edge.pageLoadStrategy")
  pageLoadStrategy: Maybe<"normal" | "eager" | "none">;
}
