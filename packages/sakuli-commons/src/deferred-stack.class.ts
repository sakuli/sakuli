import {deferred, DeferredValue} from "./deferred.function";

export class DeferredStack {
    readonly deferreds: DeferredValue<void>[] = [];
    private resolvedCount = 0;

    put() {
        this.deferreds.push(deferred());
    }

    pop() {
        this.deferreds[this.resolvedCount].resolve(void 0);
        this.resolvedCount++;
    }

    get size() {
        return this.deferreds.length;
    }

    async resolved() {
        return Promise.all(this.deferreds.map(d => d.promise)).then(() => {});
    }
}