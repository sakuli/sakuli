import { Maybe } from "@sakuli/commons";
import { Measurable, isStarted, isFinished, StartedMeasurable, FinishedMeasurable, getDuration } from "./measureable.interface";
import { IsDate, IsNumber, validate } from "class-validator";

export type TestCaseEntityKind = "step" | "suite" | "case" | "action"

export abstract class TestContextEntity implements Measurable {
    abstract kind: TestCaseEntityKind;
    id: Maybe<string>;

    @IsDate()
    startDate: Maybe<Date>;

    @IsDate()
    endDate: Maybe<Date>;

    @IsNumber()
    criticalTime: Maybe<number>;

    @IsNumber()
    warningTime: Maybe<number>;

    isStarted(): this is StartedMeasurable {
        return isStarted(this);
    }

    isFinished(): this is FinishedMeasurable {
        return this.isStarted() && isFinished(this);
    }

    get duration() {
        if(this.isFinished()) {
            return getDuration(this);
        } else {
            throw Error(`Please finish the ${this.kind} '${this.id}' before accessing duration`)
        }
    }

    async isValid(): Promise<boolean> {
        const err = await validate(this);
        return err.length === 0;
    }

}