export function renderArray<T>(arr: T[], render: (e: T) => string) {
    return `${arr.map(render).join('')}`
}