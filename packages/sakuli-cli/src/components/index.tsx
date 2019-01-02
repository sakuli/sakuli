import {render, h} from "ink";
import {TestExecutionComponent} from "./execution-component.class";
import {Sakuli} from "@sakuli/core";

export default function renderExecution() {
    return render(<TestExecutionComponent testExecution={Sakuli().testExecutionContext}/>)
}