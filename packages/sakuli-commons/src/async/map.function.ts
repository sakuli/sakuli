export function mapAsync<T, U>(callbackfn: (value: T, index: number, array: T[]) => Promise<U>): (data: T[]) => Promise<U[]> {
    return (array: T[]) => Promise.all(array.map(callbackfn))
}
