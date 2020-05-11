import { BooleanProperty, Maybe, Property, StringProperty, } from "@sakuli/commons";
import { ProxyConfig } from "selenium-webdriver";

export class FirefoxProperties {
  /**
   * Sets the profile to use. The profile may be specified
   * as the path to an existing Firefox profile to use
   * as a template.
   */
  @StringProperty("selenium.firefox.profile")
  profile: Maybe<string>;

  /**
   * Sets the binary to use. The binary may be specified as the path to a
   * Firefox executable, or as a {@link Binary} object.
   */
  @StringProperty("selenium.firefox.binary")
  binary: Maybe<string>;

  @Property("selenium.firefox.proxy")
  proxy: Maybe<ProxyConfig>;

  @BooleanProperty("selenium.firefox.useGeckoDriver")
  useGeckoDriver: Maybe<boolean>;
}
