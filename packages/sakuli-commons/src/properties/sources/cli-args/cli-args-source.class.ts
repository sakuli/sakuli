import { PropertyMap, PropertySource } from "../../model";
import yargs from "yargs";
import { argvLens } from "./argv-lens.function";
import { isPresent } from "../../../maybe";

export class CliArgsSource implements PropertySource {
  constructor(readonly args: string[] = process.argv) {}

  async createPropertyMap(): Promise<PropertyMap> {
    const argv = yargs(this.args).argv;
    const get = (key: string) => {
      return argvLens(key.split("."))(argv);
    };

    const has = (key: string) => {
      return isPresent(get(key));
    };
    return { get, has };
  }
}
