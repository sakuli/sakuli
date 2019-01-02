import {getReadableStateName, TestContextEntity, TestContextEntityStates} from "@sakuli/core";
import {Bold, Color, h} from "ink";

export interface StateIndicatorProps {
    entity: TestContextEntity
}


export function StateIndicator({entity}: StateIndicatorProps) {
    const stateText = <Bold>{getReadableStateName(entity.state)}</Bold>;
    if(entity.error) {
        return <Color red>{stateText}</Color>
    }
    if(entity.state === TestContextEntityStates.WARNING) {
        return <Color redBright>{stateText}</Color>
    }
    if(entity.state === TestContextEntityStates.CRITICAL) {
        return <Color red>{stateText}</Color>
    }
    if(entity.state === TestContextEntityStates.OK) {
        return <Color green>{stateText}</Color>
    }
    return '';
}