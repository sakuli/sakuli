import {getReadableStateName, TestContextEntity, TestContextEntityStates} from "@sakuli/core";
import {Bold, Color, h} from "ink";

export interface StateIndicatorProps {
    entity: TestContextEntity
}


export function StateIndicator({entity}: StateIndicatorProps) {
    const stateText = <Bold>{entity.state}{getReadableStateName(entity.state)}</Bold>;
    if(!entity.isFinished()) {
        return '';
    }
    if(entity.error || entity.state === TestContextEntityStates.ERROR) {
        return <Color bgRed> × </Color>
    }
    if(entity.state === TestContextEntityStates.WARNING) {
        return <Color redBright>{stateText}</Color>
    }
    if(entity.state === TestContextEntityStates.CRITICAL) {
        return <Color red>{stateText}</Color>
    }
    if(entity.state === TestContextEntityStates.OK) {
        return <Color bgGreen black> ✓ </Color>
    }
    return '';
}