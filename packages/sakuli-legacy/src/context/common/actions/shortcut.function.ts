import {Key} from "../key.class";

export const getSuperKey = () => {
    return (process.platform === "darwin") ? Key.CMD : Key.CTRL;
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
