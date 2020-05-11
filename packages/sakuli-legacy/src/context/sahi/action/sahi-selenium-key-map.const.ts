import { Key } from "selenium-webdriver";

/**
 *
 *
 * Any combo key: can be "CTRL", "SHIFT", "ALT" or "META";
 Can also be two or more keys together like "CTRL|SHIFT"
 This argument is applicable only for Browser mode
 *
 */

const SahiSeleniumKeyMap = new Map<string, string>([
  ["CTRL", Key.CONTROL],
  ["SHIFT", Key.SHIFT],
  ["ALT", Key.ALT],
  ["META", Key.META],
]);

export function getSeleniumKeysFromComboString(combo: string): string[] {
  const keys = combo.split("|");
  return keys
    .filter((k) => SahiSeleniumKeyMap.has(k))
    .map((k) => SahiSeleniumKeyMap.get(k)!);
}
