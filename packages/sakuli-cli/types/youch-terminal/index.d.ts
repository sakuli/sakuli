declare module 'youch-terminal' {
    import {SerializedError} from "youch";
    export default function forTerminal(error: SerializedError): string;
}