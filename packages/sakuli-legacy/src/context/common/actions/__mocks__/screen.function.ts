import { Region } from "../../region";

const highlightMock = jest.fn(
  (regionToHighlight: Region) =>
    new Promise<Region>((res) => res(regionToHighlight))
);
const findMock = jest.fn();
const waitForImageMock = jest.fn();
const heightMock = jest.fn();
const widthMock = jest.fn();
const takeScreenShotMock = jest.fn();
const takeScreenShotWithTimestampMock = jest.fn();

export const ScreenApi = {
  highlight: highlightMock,
  find: findMock,
  waitForImage: waitForImageMock,
  height: heightMock,
  width: widthMock,
  takeScreenshot: takeScreenShotMock,
  takeScreenshotWithTimestamp: takeScreenShotWithTimestampMock,
};
