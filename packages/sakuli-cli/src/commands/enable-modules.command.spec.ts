import { CommandModule } from "yargs";
import { prompt } from "inquirer";
import { AllModuleChoices } from "./enable-features/module-choices.const";
import { getBootstrapTasks } from "./enable-features/get-bootstrap-tasks.function";

jest.mock("inquirer")
jest.mock("./enable-features/get-bootstrap-tasks.function")
jest.spyOn(process, 'exit').mockImplementation((_) => {return undefined as never});
jest.spyOn(console, "error");

describe("enable module", () => {

    beforeEach(async () => {
        jest.clearAllMocks();
    })

    it("should ask for modules", async () => {

        //GIVEN
        const enableModules: CommandModule = await import("./enable-modules.command");
        (getBootstrapTasks as jest.Mock).mockImplementation(() => [])

        //WHEN
        await enableModules.handler({} as any);

        //THEN
        expect(prompt).toHaveBeenCalledWith(
            expect.arrayContaining(
                [expect.objectContaining(
                    { choices: AllModuleChoices }
                )]))

    })

    it("should processBoostrapTasks", async () => {

        //GIVEN
        const enableModules: CommandModule = await import("./enable-modules.command");
        (prompt as unknown as jest.Mock).mockImplementation(() => {return {features: ["foobar"]}});
        const mockedBoostrapCommand = jest.fn();
        (getBootstrapTasks as jest.Mock).mockImplementation(() => [mockedBoostrapCommand])

        //WHEN
        await enableModules.handler({} as any);

        //THEN
        expect(mockedBoostrapCommand).toHaveBeenCalled();
        expect(process.exit).toHaveBeenCalledWith(0);
    })

    it("should exit and log on error", async () => {

        //GIVEN
        const enableModules: CommandModule = await import("./enable-modules.command");
        (prompt as unknown as jest.Mock).mockImplementation(() => {return {features: ["foobar"]}});
        const errorMessage = "Nonono!"
        const mockedBoostrapCommand = jest.fn().mockRejectedValue(errorMessage);
        (getBootstrapTasks as jest.Mock).mockImplementation(() => [mockedBoostrapCommand])

        //WHEN
        await enableModules.handler({} as any);

        //THEN
        expect(process.exit).toHaveBeenCalledWith(1);
        expect(console.error).toHaveBeenCalledWith(errorMessage);
    })
})