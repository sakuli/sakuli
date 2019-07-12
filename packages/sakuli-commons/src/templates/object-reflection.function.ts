import {Reflection} from "./reflection.type";
import {createLens} from "../properties/sources/create-lens.function";

/**
 * Utility function for more declarative use of template function
 *
 * <code>
 *     const tpl = template("...");
 *     const rendered = tpl(objectReflection({
 *
 *     }));
 * </code>
 * @param v
 * @param separator
 */
export const objectReflection = (v: object, separator: string = '.'): Reflection => {
    const lens = createLens(v);
    return (key: string) => lens(key.split(separator));
}