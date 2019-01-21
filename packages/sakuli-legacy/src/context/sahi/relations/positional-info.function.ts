import {ILocation, ISize, WebElement} from "selenium-webdriver";

export interface PositionalInfo {
    location: ILocation,
    size: ISize,
    origin: WebElement,
}

export async function positionalInfo(origin: WebElement): Promise<PositionalInfo> {
    const [location, size] = await Promise.all([
        origin.getLocation(),
        origin.getSize(),
    ]);
    return ({
        location,
        size,
        origin,
    })
}