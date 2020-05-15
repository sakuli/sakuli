import { ILocation, ISize, WebElement } from "selenium-webdriver";

export interface PositionalInfo {
  location: ILocation;
  size: ISize;
  origin: WebElement;
}

export async function positionalInfo(
  origin: WebElement
): Promise<PositionalInfo> {
  const rect = await origin.getRect();
  return {
    location: { x: rect.x, y: rect.y },
    size: { width: rect.width, height: rect.height },
    origin,
  };
}
