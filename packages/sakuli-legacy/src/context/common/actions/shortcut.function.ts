import {Key} from "@nut-tree/nut-js";

export const getSuperKey = () => {
    return (process.platform === "darwin") ? Key.LeftSuper : Key.LeftControl;
};

export const copyShortcut = () => {
    return [getSuperKey(), Key.C];
};

export const cutShortcut = () => {
    return [getSuperKey(), Key.X];
};

export const pasteShortcut = () => {
    return [getSuperKey(), Key.V];
};
