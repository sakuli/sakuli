import {PropertyMap} from "../model";
import {createLens} from "../sources/create-lens.function";
import {isPresent} from "../../maybe";

export class ObjectMap implements PropertyMap {

    private readonly lens: (key:string[]) => any;
    private readonly cache: Map<string, any> = new Map();

    constructor(
        private readonly value: any
    ) {
        this.lens = createLens(value);
    }

    get(key: string): any {
        if(!this.cache.has(key)) {
            this.cache.set(key, this.lens(key.split('.')));
        }
        return this.cache.get(key);
    }

    has(key: string): boolean {
        return isPresent(this.get(key));
    }

}
