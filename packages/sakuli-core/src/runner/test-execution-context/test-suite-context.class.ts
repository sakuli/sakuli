import { IsString, IsDate, IsNumber } from "class-validator";
import { Maybe } from "@sakuli/commons";
import { Measurable } from "./measureable.interface";
import { TestCaseContext } from "./test-case-context.class";

export class TestSuiteContext implements Measurable {
    @IsString()
    id: Maybe<string>;

    @IsDate()
    startDate: Maybe<Date>;

    @IsDate()
    endDate: Maybe<Date>;

    @IsNumber()
    criticalTime: Maybe<number>;

    @IsNumber()
    warningTime: Maybe<number>;

    testCases: TestCaseContext[] = [];
}
