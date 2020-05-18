declare module "youch" {
  import { ClientRequest } from "http";

  export interface SerializedError {
    error: any;
  }

  export class Youch {
    constructor(e: Error, req: ClientRequest | {});
    toHtml(): Promise<string>;
    toJSON(): Promise<SerializedError>;
    addLink(cb: (e: Error) => string): Youch;
  }

  export default Youch;
}
