import {Region} from "./region.interface";

export interface Application {
    open(): Promise<Application>;

    focus(): Promise<Application>;

    focusWindow(windowNumber: number): Promise<Application>;

    close(optSilent?: boolean): Promise<Application>;

    kill(optSilent?: boolean): Promise<Application>;

    setSleepTime(seconds: number): Application;

    getRegion(): Promise<Region>;

    getRegionForWindow(windowNumber: number): Promise<Region>;

    getName(): string;
}
