import {createApplicationClass} from "./sakuli-application.class";
import {Project, TestExecutionContext} from "@sakuli/core";
import {Application} from "./application.interface";
import {createThenableRegionClass} from "../region";
import {ThenableApplication} from "./thenable-application.interface";
import {Type} from "@sakuli/commons";

export function createThenableApplicationClass(ctx: TestExecutionContext, project: Project): Type<ThenableApplication> {
    const Application = createApplicationClass(ctx, project);
    const ThenableRegion = createThenableRegionClass(ctx, project);
    return class ThenableSakuliApplication {
        constructor(
            readonly name: string,
            readonly application: Promise<Application> = Promise.resolve(new Application(name))
        ) {}

        close(optSilent?: boolean): ThenableSakuliApplication {
            return new ThenableSakuliApplication(
                this.name,
                this.application.then(a => a.close(optSilent))
            );
        }

        focus(): ThenableSakuliApplication {
            return new ThenableSakuliApplication(
                this.name,
                this.application.then(a => a.focus())
            );
        }

        focusWindow(windowNumber: number): ThenableSakuliApplication {
            return new ThenableSakuliApplication(
                this.name,
                this.application.then(a => a.focusWindow(windowNumber))
            );
        }

        getName(): string {
            return this.name;
        }

        getRegion() {
            return new ThenableRegion(
                0, 0, 0, 0,
                this.application.then(app => app.getRegion())
            );
        }

        getRegionForWindow(windowNumber: number) {
            return new ThenableRegion(
                0, 0, 0, 0,
                this.application.then(app => app.getRegionForWindow(windowNumber))
            );
        }

        kill(optSilent?: boolean): ThenableSakuliApplication {
            return new ThenableSakuliApplication(
                this.name,
                this.application.then(app => app.kill(optSilent))
            )
        }

        open(): ThenableSakuliApplication {
            return new ThenableSakuliApplication(
                this.name,
                this.application.then(app => app.open())
            )
        }

        setSleepTime(seconds: number): ThenableSakuliApplication {
            return new ThenableSakuliApplication(
                this.name,
                this.application.then(app => app.setSleepTime(seconds))
            )
        }

        then<TResult1 = Application, TResult2 = never>(onfulfilled?: ((value: Application) => (PromiseLike<TResult1> | TResult1)) | undefined | null, onrejected?: ((reason: any) => (PromiseLike<TResult2> | TResult2)) | undefined | null): PromiseLike<TResult1 | TResult2> {
            return this.application.then(
                onfulfilled,
                onrejected
            )
        }
    }
}