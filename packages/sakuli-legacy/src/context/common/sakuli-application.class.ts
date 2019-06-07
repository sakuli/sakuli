import {ScreenApi} from "./actions/screen.function";
import {Application} from "./application.interface";
import {TestExecutionContext} from "@sakuli/core";
import {Region} from "./region.interface";
import {createRegionClass} from "./sakuli-region.class";
import {ChildProcess, exec, spawn} from "child_process";
import {runAsAction} from "./actions/action.function";

const killProcess = (pid: number) => {
    if (process.platform === "win32") {
        exec(`Taskkill /PID ${pid} /F`);
    } else {
        exec(`kill -9 ${pid}`);
    }
};

export function createApplicationClass(ctx: TestExecutionContext) {
    return class SakuliApplication implements Application {
        public sleepTime = 0;
        public process?: ChildProcess;

        constructor(public readonly name: string) {
        }

        public async open(): Promise<Application> {
            return runAsAction(ctx, "runCommand", () => {
                ctx.logger.debug(`Opening application '${this.name}`);
                return new Promise<Application>((resolve, reject) => {
                    try {
                        if (!this.process) {
                            this.process = spawn(this.name);
                        } else {
                            ctx.logger.debug(`Application already open: PID=${this.process.pid}`)
                        }
                        setTimeout(() => resolve(this), this.sleepTime * 1000);
                    } catch (e) {
                        reject(e);
                    }
                });
            })();
        }

        public async focus(): Promise<Application> {
            ctx.logger.debug(`Focusing application '${this.name}`);
            throw new Error("Not Implemented");
        }

        public async focusWindow(windowNumber: number): Promise<Application> {
            ctx.logger.debug(`Focusing window #${windowNumber} of application '${this.name}`);
            throw new Error("Not Implemented");
        }

        public async close(optSilent?: boolean): Promise<Application> {
            return runAsAction(ctx, "close", () => {
                return new Promise<Application>((resolve, reject) => {
                    ctx.logger.debug(`Closing application '${this.name}${optSilent ? ' silently' : ''}`);
                    if (this.process) {
                        try {
                            killProcess(this.process.pid);
                            resolve(this);
                        } catch (e) {
                            if (!optSilent) {
                                reject(`Failed to close application with PID=${this.process.pid}`);
                            } else {
                                resolve(this);
                            }
                        }
                    } else {
                        ctx.logger.warn(`No application open to close.`);
                        resolve(this);
                    }
                });
            })();
        }

        public async kill(optSilent?: boolean): Promise<Application> {
            return runAsAction(ctx, "kill", () => {
                return new Promise<Application>((resolve, reject) => {
                    ctx.logger.debug(`Killing application '${this.name}${optSilent ? ' silently' : ''}`);
                    if (this.process) {
                        try {
                            killProcess(this.process.pid);
                            resolve(this);
                        } catch (e) {
                            if (!optSilent) {
                                reject(`Failed to kill application with PID=${this.process.pid}`);
                            } else {
                                resolve(this);
                            }
                        }
                    } else {
                        ctx.logger.warn(`No application open to close.`);
                        resolve(this);
                    }
                });
            })();
        }

        public setSleepTime(seconds: number): Application {
            ctx.logger.debug(`Updating startup delay from ${this.sleepTime} to ${seconds}`);
            if (seconds < 0) {
                ctx.logger.warn(`Invalid value for sleep time: ${seconds}. Skipping update`);
                return this;
            }
            this.sleepTime = seconds;
            return this;
        }

        public async getRegion(): Promise<Region> {
            return runAsAction(ctx, "getRegion", async () => {
                ctx.logger.debug(`Determining region for main window of ${this.name}`);
                const RegionImpl = createRegionClass(ctx);
                return new RegionImpl(0, 0, await ScreenApi.width(), await ScreenApi.height());
            })();
        }

        public async getRegionForWindow(windowNumber: number): Promise<Region> {
            return runAsAction(ctx, "getRegionForWindow", async () => {
                ctx.logger.debug(`Determining region for window #${windowNumber} of ${this.name}`);
                const RegionImpl = createRegionClass(ctx);
                return new RegionImpl(0, 0, await ScreenApi.width(), await ScreenApi.height());
            })();
        }

        public getName(): string {
            ctx.logger.debug(`Returning app name '${this.name}'`);
            return this.name;
        }
    };
}