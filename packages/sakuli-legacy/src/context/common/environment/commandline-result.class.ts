export class CommandLineResult {
  constructor(
    private readonly output: string,
    private readonly exitCode: number
  ) {}

  getOutput(): string {
    return this.output;
  }

  getExitCode(): number {
    return this.exitCode;
  }
}
