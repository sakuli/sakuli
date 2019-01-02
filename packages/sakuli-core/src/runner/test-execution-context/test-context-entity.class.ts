import {ifPresent, Maybe} from "@sakuli/commons";
import {
    FinishedMeasurable,
    getDuration,
    isFinished,
    isStarted,
    Measurable,
    StartedMeasurable
} from "./measureable.interface";
import {IsDate, IsNumber, validateSync} from "class-validator";
import {TestContextEntityState, TestContextEntityStates} from "./test-context-entity-state.class";
import {isBefore, isEqual} from "date-fns";

export type TestContextKindSuite = "suite";
export type TestContextKindCase = "case";
export type TestContextKindStep = "step";
export type TestContextKindSAction = "action";
export type TestContextEntityKind =
    TestContextKindSuite |
    TestContextKindCase |
    TestContextKindStep |
    TestContextKindSAction;

export abstract class TestContextEntity implements Measurable {
    abstract kind: TestContextEntityKind;

    id: Maybe<string> = '';

    @IsDate()
    startDate: Maybe<Date>;

    @IsDate()
    endDate: Maybe<Date>;

    @IsNumber()
    criticalTime: number = 0;

    @IsNumber()
    warningTime: number = 0;

    error: Maybe<Error>;

    get duration() {
        if (this.isFinished()) {
            return getDuration(this);
        } else {
            throw Error(`Please finish the ${this.kind} '${this.id}' before accessing duration`)
        }
    }

    get state(): TestContextEntityState {
        return ifPresent(this.error,
            _ => TestContextEntityStates.ERROR,
            () => {
                if (this.criticalTime > 0 && this.duration > this.criticalTime) {
                    return TestContextEntityStates.CRITICAL
                }
                if (this.warningTime > 0 && this.duration > this.warningTime) {
                    return TestContextEntityStates.WARNING
                }
                return TestContextEntityStates.OK
            }
        )
    }

    isStarted(): this is StartedMeasurable {
        return isStarted(this);
    }

    isFinished(): this is FinishedMeasurable {
        return this.isStarted() && isFinished(this);
    }

    isValid(): this is FinishedMeasurable {
        const err = validateSync(this);
        return err.length === 0
            && (isEqual(<Date>this.startDate, <Date>this.endDate)
                || isBefore(<Date>this.startDate, <Date>this.endDate));
    }

}