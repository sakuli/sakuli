export type Maybe<T> = T | null | undefined;

export function isPresent<T>(maybe: Maybe<T>): maybe is T {
    if(typeof maybe === 'number') {
        return !isNaN(maybe);
    } else {
        return maybe != null;
    }
}

export function ifPresent<T>(maybe: Maybe<T>, then: (v: T) => void): void;
export function ifPresent<T, R = void>(maybe: Maybe<T>, then: (v: T) => R, otherwise: () => R): R;
export function ifPresent<T, R = void>(maybe: Maybe<T>, then: (v: T) => R, otherwise?: () => R): R | void {
    if (isPresent(otherwise)) {
        if (isPresent(maybe)) {
            return then(maybe);
        } else {
            return otherwise();
        }
    } else {
        if(isPresent(maybe)) {
            then(maybe);
        }
    }
}

export function ensure<T>(maybe: Maybe<T>, fallback: T): T {
    return ifPresent(maybe, x => x, () => fallback);
}

export function throwIfAbsent<T>(maybe: Maybe<T>, error: Error): T | never {
    return ifPresent(maybe, x => x, () => {throw error});
}