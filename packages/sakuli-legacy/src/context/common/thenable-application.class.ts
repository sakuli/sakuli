import {createApplicationClass} from "./sakuli-application.class";
import {TestExecutionContext} from "@sakuli/core";
import {Application} from "./application.interface";
import {createThenableRegionClass, ThenableRegion} from "./thenable-sakuli-region.class";

export function createThenableApplicationClass(ctx: TestExecutionContext) {
    const Application = createApplicationClass(ctx);
    const ThenableRegion = createThenableRegionClass(ctx);
    return class ThenableApplicationClass implements PromiseLike<Application>{
        constructor(
            readonly name: string,
            readonly application: Promise<Application> = Promise.resolve(new Application(name))
        ) {}

        close(optSilent?: boolean): ThenableApplicationClass {
            return new ThenableApplicationClass(
                this.name,
                this.application.then(a => a.close(optSilent))
            );
        }

        focus(): ThenableApplicationClass {
            return new ThenableApplicationClass(
                this.name,
                this.application.then(a => a.focus())
            );
        }

        focusWindow(windowNumber: number): ThenableApplicationClass {
            return new ThenableApplicationClass(
                this.name,
                this.application.then(a => a.focusWindow(windowNumber))
            );
        }

        getName(): string {
            return this.name;
        }

        getRegion() {
            return new ThenableRegion(
                0,0,0,0,
                this.application.then(app => app.getRegion())
            );
        }

        getRegionForWindow(windowNumber: number) {
            return new ThenableRegion(
                0,0,0,0,
                this.application.then(app => app.getRegionForWindow(windowNumber))
            );
        }

        kill(optSilent?: boolean): ThenableApplicationClass {
            return new ThenableApplicationClass(
                this.name,
                this.application.then(app => app.kill(optSilent))
            )
        }

        open(): ThenableApplicationClass {
            return new ThenableApplicationClass(
                this.name,
                this.application.then(app => app.open())
            )
        }

        setSleepTime(seconds: number): ThenableApplicationClass {
            return new ThenableApplicationClass(
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