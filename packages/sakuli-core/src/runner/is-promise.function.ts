export const isPromise = <T = any>(value: any): value is Promise<T>  => {
    return value && value['then'] && typeof value.then === 'function'
}
