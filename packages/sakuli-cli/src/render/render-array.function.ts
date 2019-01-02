export function renderArray<T>(arr: T[], render: (e: T) => Promise<string>) {
    return Promise.all(arr.map(render)).then(rendered => rendered.join(''))
}