/**
 * Up: \u001b[{n}A
 Down: \u001b[{n}B
 Right: \u001b[{n}C
 Left: \u001b[{n}D
 */

import {EOL} from "os";

enum Direction {
    UP = 'A',
    DOWN = 'B',
    RIGHT = 'C',
    LEFT = 'D'
}

export class CommandLine {
    constructor(
        readonly stream: NodeJS.WritableStream = process.stdout
    ) {}

    move(chars: number, dir: Direction) {
        this.stream.write(`\u001b[${chars}${dir}`);
        return this;
    }

    up(chars: number = 1) {
        this.move(chars, Direction.UP);
        return this;
    }

    down(chars: number = 1) {
        this.move(chars, Direction.DOWN);
        return this;
    }

    left(chars: number = 1) {
        this.move(chars, Direction.LEFT);
        return this;
    }

    right(chars: number = 1) {
        this.move(chars, Direction.RIGHT);
        return this;
    }

    write(text: string | Buffer) {
        this.stream.write(text);
        return this;
    }

    newLine() {
        this.stream.write(EOL);
        return this;
    }

    /**
     * clears from cursor until end of screen
     */
    clearToEnd() {
        this.stream.write(`\u001b[0J`);
        return this;
    }

    /**
     * clears from cursor to beginning of screen
     */
    clearToBeginn() {
        this.stream.write(`\u001b[1J`);
        return this;
    }


    clearScreen() {
        this.stream.write(`\u001b[2J`);
        return this;
    }

    /**
     *  clears from cursor to end of line
     */
    clearCurrentLineToEnd() {
        this.stream.write(`\u001b[0K`);
        return this;
    }

    /**
     *  clears from cursor to start of line
     */
    clearCurrentLineToBeginn() {
        this.stream.write(`\u001b[1K`);
        return this;
    }

    clearCurrentLine() {
        this.stream.write(`\u001b[2K`);
        return this;
    }


    setColumn(n: number) {
        this.stream.write(`\u001b[${n}G`);
        return this;
    }

    setPosition(n: number, m: number) {
        this.stream.write(`\u001b[${n};${m}H`);
        return this;
    }

    savePosition() {
        this.stream.write(`\u001b[s`);
        return this;
    }

    restorePosition() {
        this.stream.write('\u001b[u');
        return this;
    }

}

const _cli = new CommandLine();

/**
 * Returns a singleton instance of {@code CommandLine} which writes to <code>process.stdout</code>
 */
export function cli() {
    return _cli;
}