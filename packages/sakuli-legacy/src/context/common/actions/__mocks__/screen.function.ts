import { Region } from "../../region";
import { ScreenRegionResult } from "../screen.function";

const highlightMock = jest.fn(
  (regionToHighlight: Region) =>
    new Promise<Region>((res) => res(regionToHighlight))
);
const findMock = jest.fn(() => {
  return new Promise<ScreenRegionResult>((resolve, reject) => {
    resolve({
      left: 0,
      top: 0,
      width: 100,
      height: 100,
    });
  });
});
const waitForImageMock = jest.fn(() => {
  return new Promise<ScreenRegionResult>((resolve, reject) => {
    resolve({
      left: 0,
      top: 0,
      width: 100,
      height: 100,
    });
  });
});
const heightMock = jest.fn();
const widthMock = jest.fn();
const takeScreenShotMock = jest.fn();
const takeScreenShotWithTimestampMock = jest.fn();
const getRegionFromFocusedWindowMock = jest.fn(() => {
  return new Promise<ScreenRegionResult>((resolve, reject) => {
    resolve({
      left: 10,
      top: 20,
      width: 30,
      height: 40,
    });
  });
});

export const ScreenApi = {
  highlight: highlightMock,
  find: findMock,
  waitForImage: waitForImageMock,
  height: heightMock,
  width: widthMock,
  takeScreenshot: takeScreenShotMock,
  takeScreenshotWithTimestamp: takeScreenShotWithTimestampMock,
  getRegionFromFocusedWindow: getRegionFromFocusedWindowMock,
};
