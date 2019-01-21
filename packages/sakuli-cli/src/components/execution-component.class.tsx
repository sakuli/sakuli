import {Component, Fragment, h} from 'ink'
import {TestExecutionContext, TestSuiteContext} from "@sakuli/core";
import {TestEntity} from "./test-entity-component.function";
import Timeout = NodeJS.Timeout;
import {inspect} from "util";
import {throwIfAbsent} from "@sakuli/commons";

export interface TestExecutionComponentProps {
    testExecution: TestExecutionContext
}

export interface TestExecutionComponentState {
    testSuites: TestSuiteContext[]
    tick: number;
    log: string[]
}

export class TestExecutionComponent extends Component<TestExecutionComponentProps, TestExecutionComponentState> {

    timer: Timeout | null = null;

    constructor(props: TestExecutionComponentProps) {
        super(props);
        this.state = {
            testSuites: [],
            tick: 0,
            log: []
        }
    }

    componentDidMount() {
        this.props.testExecution.onChange(tec => {
            this.setState({
                testSuites: tec.testSuites
            });
        });
        this.timer = setInterval(() => {
            this.setState(({tick}) => ({
                tick: tick + 1
            }));
        }, 180);

    }

    componentWillUnmount() {
        if (this.timer) {
            clearInterval(this.timer)
        }
    }

    render() {
        return (
            <Fragment>
                <div>
                    {this.state.testSuites.map(suite => (
                        <TestEntity entity={suite} tick={this.state.tick}/>
                    ))}
                </div>
            </Fragment>
        )

    }
}