export type ClickOptions = {
    force: boolean
}

export const isClickOptions = (options: any): options is ClickOptions => {
    return (options as ClickOptions).force !== undefined;
};