import { Application } from "./application.interface";
import { ThenableRegion } from "../region";

export interface NewableThenableApplication {
    new(name: string): ThenableApplication;
}

export interface ThenableApplication extends PromiseLike<Application> {
    readonly name: string;
    readonly application: Promise<Application>;

    close(optSilent?: boolean): ThenableApplication;

    focus(): ThenableApplication;

    focusWindow(windowNumber: number): ThenableApplication;

    getName(): string;

    getRegion(): ThenableRegion;

    getRegionForWindow(windowNumber: number): ThenableRegion;

    kill(optSilent?: boolean): ThenableApplication;

    open(): ThenableApplication;

    setSleepTime(seconds: number): ThenableApplication;
}