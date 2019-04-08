import {PropertySource} from "../../model/property-source.interface";
import {PropertyMap} from "../../model/property-map.interface";
import yargs from 'yargs';
import {argvLens} from "./argv-lens.function";

export class CliArgsSource implements PropertySource {

    constructor(readonly args: string[] = process.argv) {}

    async createPropertyMap(): Promise<PropertyMap> {
        const argv = yargs(this.args).argv;
        const get = (key: string) => {
            return argvLens(key.split('.'))(argv);
        };

        const has = (key: string) => {
            return get(key) != null;
        };
        return {get, has};
    }

}