import {Application} from "./application.interface";
import {Project, TestExecutionContext} from "@sakuli/core";
import {ChildProcess, spawn} from "child_process";
import {runAsAction, ScreenApi} from "../actions";
import {createRegionClass, Region} from "../region";
import {Type} from "@sakuli/commons";

export function createApplicationClass(ctx: TestExecutionContext, project: Project): Type<Application> {
    const RegionImpl = createRegionClass(ctx, project);
    return class SakuliApplication implements Application {
        private readonly cmd: string;
        private readonly args: string[];
        public sleepTime = 0;
        public process?: ChildProcess;

        constructor(command: string) {
            const [cmd, ...options] = command.split(/(?<!\\)\s/);
            this.cmd = cmd.split(/\\/).join("");
            this.args = options;
        }

        public async open(): Promise<Application> {
            return runAsAction(ctx, "runCommand", () => {
                ctx.logger.debug(`Opening application '${this.cmd}${this.args.length ? ` with args ${this.args}` : ''}`);
                return new Promise<Application>((resolve, reject) => {
                    try {
                        if (!this.process) {
                            this.process = spawn(this.cmd, this.args);
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
            ctx.logger.debug(`Focusing application '${this.cmd}`);
            throw new Error("Not Implemented");
        }

        public async focusWindow(windowNumber: number): Promise<Application> {
            ctx.logger.debug(`Focusing window #${windowNumber} of application '${this.cmd}`);
            throw new Error("Not Implemented");
        }

        public async close(optSilent?: boolean): Promise<Application> {
            return runAsAction(ctx, "close", () => {
                return new Promise<Application>(async (resolve, reject) => {
                    ctx.logger.debug(`Closing application '${this.cmd}${optSilent ? ' silently' : ''}`);
                    if (this.process) {
                        try {
                            this.process.kill('SIGTERM');
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
                    ctx.logger.debug(`Killing application '${this.cmd}${optSilent ? ' silently' : ''}`);
                    if (this.process) {
                        try {
                            this.process.kill('SIGKILL');
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
                ctx.logger.debug(`Determining region for main window of ${this.cmd}`);
                return new RegionImpl(0, 0, await ScreenApi.width(), await ScreenApi.height());
            })();
        }

        public async getRegionForWindow(windowNumber: number): Promise<Region> {
            return runAsAction(ctx, "getRegionForWindow", async () => {
                ctx.logger.debug(`Determining region for window #${windowNumber} of ${this.cmd}`);
                return new RegionImpl(0, 0, await ScreenApi.width(), await ScreenApi.height());
            })();
        }

        public getName(): string {
            return runAsAction(ctx, "getName", () => {
                ctx.logger.debug(`Returning app name '${this.cmd}'`);
                return this.cmd;
            })();
        }
    };
}