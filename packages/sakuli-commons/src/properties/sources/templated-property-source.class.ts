import {PropertyMap} from "../model";
import {template} from "../../templates";

export class TemplatedPropertyMap implements PropertyMap {

    constructor(
        readonly baseMap: PropertyMap
    ) {}

    get(key: string): any {
        if(this.has(key)) {
            const tpl = template(this.baseMap.get(key));
            return tpl(tplVar => this.baseMap.get(tplVar));
        } else {
            return null;
        }
    }

    has(key: string): boolean {
        return this.baseMap.has(key);
    }

}