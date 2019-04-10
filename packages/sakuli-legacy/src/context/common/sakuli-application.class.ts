import {ScreenApi} from "./actions/screen.function";
import {Application} from "./application.interface";
import {TestExecutionContext} from "@sakuli/core";
import {Region} from "./region.interface";
import {createRegionClass} from "./sakuli-region.class";
import {ChildProcess, exec, spawn} from "child_process";

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
            ctx.logger.info(`Opening application '${this.name}`);
            return new Promise<Application>((resolve, reject) => {
                try {
                    if (!this.process) {
                        this.process = spawn(this.name);
                    } else {
                        ctx.logger.info(`Application already open: PID=${this.process.pid}`)
                    }
                    setTimeout(() => resolve(this), this.sleepTime * 1000);
                } catch (e) {
                    reject(e);
                }
            });
        }

        public async focus(): Promise<Application> {
            ctx.logger.info(`Focusing application '${this.name}`);
            throw new Error("Not Implemented");
        }

        public async focusWindow(windowNumber: number): Promise<Application> {
            ctx.logger.info(`Focusing window #${windowNumber} of application '${this.name}`);
            throw new Error("Not Implemented");
        }

        public async close(optSilent?: boolean): Promise<Application> {
            return new Promise<Application>((resolve, reject) => {
                ctx.logger.info(`Closing application '${this.name}${optSilent ? ' silently' : ''}`);
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
        }

        public async kill(optSilent?: boolean): Promise<Application> {
            return new Promise<Application>((resolve, reject) => {
                ctx.logger.info(`Killing application '${this.name}${optSilent ? ' silently' : ''}`);
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
        }

        public setSleepTime(seconds: number): Application {
            ctx.logger.info(`Updating startup delay from ${this.sleepTime} to ${seconds}`);
            if (seconds < 0) {
                ctx.logger.warn(`Invalid value for sleep time: ${seconds}. Skipping update`);
                return this;
            }
            this.sleepTime = seconds;
            return this;
        }

        public async getRegion(): Promise<Region> {
            ctx.logger.info(`Determining region for main window of ${this.name}`);
            const RegionImpl = createRegionClass(ctx);
            return new RegionImpl(0, 0, await ScreenApi.width(), await ScreenApi.height());
        }

        public async getRegionForWindow(windowNumber: number): Promise<Region> {
            ctx.logger.info(`Determining region for window #${windowNumber} of ${this.name}`);
            const RegionImpl = createRegionClass(ctx);
            return new RegionImpl(0, 0, await ScreenApi.width(), await ScreenApi.height());
        }

        public getName(): string {
            ctx.logger.info(`Returning app name '${this.name}'`);
            return this.name;
        }
    };
}