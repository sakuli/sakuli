import {Application} from "./application.interface";
import {Project, TestExecutionContext} from "@sakuli/core";
import {ChildProcess, exec} from "child_process";
import {runAsAction, ScreenApi} from "../actions";
import {createRegionClass, Region} from "../region";
import {Type} from "@sakuli/commons";

const closeProcess = async (proc: ChildProcess) => {
    if (process.platform === "win32") {
        await exec(`Taskkill /PID ${proc.pid}`);
    } else {
        await exec(`kill -15 ${proc.pid}`);
    }
    await proc.kill("SIGTERM")
};

const killProcess = async (proc: ChildProcess) => {
    if (process.platform === "win32") {
        await exec(`Taskkill /PID ${proc.pid} /F`);
    } else {
        await exec(`kill -9 ${proc.pid}`);
    }
    await proc.kill("SIGKILL")
};

export function createApplicationClass(ctx: TestExecutionContext, project: Project): Type<Application> {
    const RegionImpl = createRegionClass(ctx, project);
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
                            this.process = exec(this.name);
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
                return new Promise<Application>(async (resolve, reject) => {
                    ctx.logger.debug(`Closing application '${this.name}${optSilent ? ' silently' : ''}`);
                    if (this.process) {
                        try {
                            await closeProcess(this.process);
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
                return new Promise<Application>(async (resolve, reject) => {
                    ctx.logger.debug(`Killing application '${this.name}${optSilent ? ' silently' : ''}`);
                    if (this.process) {
                        try {
                            await killProcess(this.process);
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
                return new RegionImpl(0, 0, await ScreenApi.width(), await ScreenApi.height());
            })();
        }

        public async getRegionForWindow(windowNumber: number): Promise<Region> {
            return runAsAction(ctx, "getRegionForWindow", async () => {
                ctx.logger.debug(`Determining region for window #${windowNumber} of ${this.name}`);
                return new RegionImpl(0, 0, await ScreenApi.width(), await ScreenApi.height());
            })();
        }

        public getName(): string {
            ctx.logger.debug(`Returning app name '${this.name}'`);
            return this.name;
        }
    };
}