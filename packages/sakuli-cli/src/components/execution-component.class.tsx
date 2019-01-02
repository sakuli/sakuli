import {Component, Fragment, h} from 'ink'
import {TestContextEntity, TestExecutionContext, TestSuiteContext} from "@sakuli/core";
import {TestEntity} from "./test-entity-component.function";
import Youch from "youch";
import {ifPresent, isPresent, Maybe} from "@sakuli/commons";
import forTerminal from "youch-terminal";
import Timeout = NodeJS.Timeout;

export interface TestExecutionComponentProps {
    testExecution: TestExecutionContext
}

export interface TestExecutionComponentState {
    testSuites: TestSuiteContext[]
    tick: number;
    renderedError: string
}

export class TestExecutionComponent extends Component<TestExecutionComponentProps, TestExecutionComponentState> {

    timer: Timeout | null = null;

    constructor(props: TestExecutionComponentProps) {
        super(props);
        this.state = {
            testSuites: [],
            tick: 0,
            renderedError: ''
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
            }))
        }, 180)
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
                <div>{this.state.renderedError}</div>
            </Fragment>
        )

    }
}