import {Component, Fragment, h} from 'ink'
import {TestExecutionContext, TestSuiteContext} from "@sakuli/core";
import {TestEntity} from "./test-entity-component.function";
import {ifPresent, LogEvent, Maybe} from "@sakuli/commons";
import {LogEvent as LogEventComponent} from './log-event.component'
import Timeout = NodeJS.Timeout;

export interface TestExecutionComponentProps {
    testExecution: TestExecutionContext
}

export interface TestExecutionComponentState {
    testSuites: TestSuiteContext[]
    tick: number;
    log: LogEvent[]
}

export class TestExecutionComponent extends Component<TestExecutionComponentProps, TestExecutionComponentState> {

    timer: Maybe<Timeout>;
    private unsubscribeLog: Maybe<() => void>;

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
        this.unsubscribeLog = this.props.testExecution.logger.onEvent(e => {
            this.setState(s => ({log: [...s.log, e]}))
        });
        this.timer = setInterval(() => {
            this.setState(({tick}) => ({
                tick: tick + 1
            }));
        }, 180);

    }

    componentWillUnmount() {
        ifPresent(this.timer, timer => clearInterval(timer));
        ifPresent(this.unsubscribeLog, unsubscribeLog => unsubscribeLog());
    }

    render() {
        return (
            <Fragment>
                <div>
                    {this.state.testSuites.map(suite => (
                        <TestEntity entity={suite} tick={this.state.tick}/>
                    ))}
                </div>
                <div>{this.state.log.map(e => <LogEventComponent {...e} />)}</div>
            </Fragment>
        )

    }
}