
import {spawn} from "child_process";
import {CommandLineResult} from "../environment";

export function execute(cmd: string, ...params: string[]): Promise<CommandLineResult> {
    return new Promise<CommandLineResult>((resolve, reject) => {
        let proc;
        if (!params || params.length === 0) {
            const [command, ...options] = cmd.split(/(?<!\\)\s/);
            const unescapedCommand = command.split(/\\/).join("");
            proc = spawn(unescapedCommand, options);
        } else {
            proc = spawn(cmd, params);
        }

        let dataBuffer: string[] = [];

        proc.stdout.on('data', (data) => {
            dataBuffer.push(data);
        });

        proc.stderr.on('data', (data) => {
            dataBuffer.push(data);
        });

        proc.on('error', (error) => {
            reject(error);
        });

        proc.on('close', (code) => {
            resolve(new CommandLineResult(dataBuffer.join(" ").trim(), code));
        });
    })
}