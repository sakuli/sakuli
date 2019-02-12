import {render, h} from "ink";
import {TestExecutionComponent} from "./execution-component.class";
import {Sakuli, TestExecutionContext} from "@sakuli/core";

export default function renderExecution(testExecutionContext: TestExecutionContext) {
    return render(<TestExecutionComponent testExecution={testExecutionContext}/>)
}