import {PropertyMap} from "../model";
import {template} from "../../templates";

export class TemplatedPropertyMap implements PropertyMap {

    constructor(
        readonly baseMap: PropertyMap
    ) {}

    get(key: string): any {
        if(this.has(key)) {
            const value = this.baseMap.get(key);
            if(typeof value === 'string') {
                const tpl = template(value);
                return tpl(tplVar => this.get(tplVar));
            }
            return value;
        } else {
            return null;
        }
    }

    has(key: string): boolean {
        return this.baseMap.has(key);
    }

}
