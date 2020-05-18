import { isPresent } from "@sakuli/commons";

export function getTestBrowserList(): ["firefox" | "chrome", boolean][] {
  return [
    ["firefox", !isPresent(process.env.FIREFOX_WD_URL)],
    ["chrome", !isPresent(process.env.CHROME_WD_URL)],
  ];
}
