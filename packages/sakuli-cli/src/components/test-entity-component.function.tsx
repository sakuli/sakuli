import {getReadableStateName, TestCaseContext, TestContextEntity, TestSuiteContext} from "@sakuli/core";
import {Bold, Color, Fragment, h} from "ink";
import {StateIndicator} from "./state-indicator-component.function";
import {Spinner} from "./spinner-component.class";
import {ifPresent} from "@sakuli/commons";

export interface TestEntityProps {
    entity: TestContextEntity;
    prefix?: any;
    suffix?: any;
    tick: number;
    ident?: number
}

function DefaultLine({
                         entity,
                         prefix: Prefix = () => '',
                         suffix: Suffix = () => '',
                         ident = 0
                     }: TestEntityProps) {
    return (
        <div>
            {createIdent(ident)}
            <Prefix/>
            <StateIndicator entity={entity}/>{' '}
            <Color blueBright>{entity.kind}</Color>{' '}
            <Color white>{entity.id || 'UNNAMED'}</Color>{' '}
            <Suffix/>
        </div>)
}


function createIdent(length: number, space: string = " "): string {
    if (length > 0) {
        return space + createIdent(length - 1, space);
    }
    return '';
}

export const TestEntity = ({entity, tick, ident = 0}: TestEntityProps) => {

    let others: any = '';
    if (entity instanceof TestSuiteContext) {
        others = entity.testCases.map(tc => <TestEntity ident={1} entity={tc} tick={tick}/>)
    }
    if (entity instanceof TestCaseContext) {
        others = entity.testSteps.map(step => <TestEntity ident={2} entity={step} tick={tick}/>)
    }
    if (entity.isFinished()) {
        return ifPresent(entity.error, e => (
                <Fragment>
                    <DefaultLine ident={ident} tick={tick} entity={entity} suffix={() => (
                        <div>{e.message}</div>
                    )}/>
                    {others}
                </Fragment>
            ), () => {
                const rightIdent = `${getReadableStateName(entity.state)} ${entity.kind} ${entity.id || 'UNNAMED'} `.length + ident;
                return <Fragment>
                    <DefaultLine ident={ident} tick={tick} entity={entity} suffix={() => (
                        <Fragment>
                            <Color gray>{createIdent(50-  rightIdent, '.')}</Color>
                            <span> ⏰ {entity.duration.toFixed(2)}s</span>
                        </Fragment>
                    )}/>
                    {others}
                </Fragment>
            })
    } else {
        return (
            <Fragment>
                <DefaultLine ident={ident} tick={tick} entity={entity} prefix={() => (
                    <Fragment>
                        <Bold><Color yellow>
                            <Spinner tick={tick}/>{' '}
                        </Color></Bold>
                    </Fragment>
                )}/>
                {others}
            </Fragment>
        )
    }
};
