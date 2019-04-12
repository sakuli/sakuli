import {CommandLineResult} from "../commandline-result.class";
import {spawn} from "child_process";

export function execute(cmd: string, ...params: string[]): Promise<CommandLineResult> {
    return new Promise<CommandLineResult>((resolve, reject) => {
        let proc;
        if (!params || params.length === 0) {
            const [command, ...options] = cmd.split(" ");
            proc = spawn(command, options);
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