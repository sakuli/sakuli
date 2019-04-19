import {TestExecutionContext} from "./test-execution-context.class";
import {TestSuiteContext} from "./test-suite-context.class";
import {mockPartial} from "sneer";
import {SimpleLogger} from "@sakuli/commons";

describe('TestExecutionContext', () => {

    let tec: TestExecutionContext;
    const loggerMock = mockPartial<SimpleLogger>({
        log: jest.fn(),
        info: jest.fn()
    });
    beforeEach(() => tec = new TestExecutionContext(loggerMock));

    describe('positive', () => {

        beforeEach(() => tec.startExecution());

        const {objectContaining, any, arrayContaining} = expect;
        const validContextEntity = (moreMatcher: object = {}) => objectContaining({
            id: any(String),
            startDate: any(Date),
            endDate: any(Date),
            ...moreMatcher
        });

        it('should add multiple testsuitecontexts', () => {
            tec.startTestSuite({id: 'First-Suite'});
            tec.endTestSuite();
            tec.startTestSuite({id: 'Second-Suite'});
            tec.updateCurrentTestSuite({
                warningTime: 40,
                criticalTime: 50
            });
            tec.endTestSuite();
            expect(tec.testSuites.length).toBe(2);
            expect(tec.testSuites).toEqual(arrayContaining([
                any(TestSuiteContext),
                any(TestSuiteContext)
            ]));
            expect(tec.testSuites).toEqual(arrayContaining([
                validContextEntity(),
                validContextEntity({
                    warningTime: any(Number),
                    criticalTime: any(Number)
                })
            ]))
        });

        it('should add testcases within testcases', () => {
            tec.startTestSuite({id: 'First-Suite'});
            tec.startTestCase({id: 'First-Case'});
            tec.endTestCase();
            tec.endTestSuite();
            tec.startTestSuite({id: 'Second-Suite'});
            tec.startTestCase({id: 'Second-Case'});
            tec.endTestCase();
            tec.startTestCase({id: 'Third-Case'});
            tec.endTestCase();
            tec.endTestSuite();

            expect(tec.testSuites.length).toBe(2);
            expect(tec.testSuites[0].testCases.length).toBe(1);
            expect(tec.testSuites[1].testCases.length).toBe(2)
        });

        it('complex', () => {

            tec.startTestSuite({id: 'S001'});
            tec.endTestSuite();
            tec.startTestSuite({id: 'S002'});
            tec.startTestCase({id: 'S002C001'});
            tec.startTestStep();
            tec.updateCurrentTestStep({id: 'late added'});
            tec.startTestAction({});
            tec.updateCurrentTestAction({id: 'Action'});
            tec.endTestAction();
            tec.endTestStep();
            tec.endTestCase();
            tec.startTestCase({id: 'S002C002'});
            tec.endTestCase();
            tec.startTestCase({id: 'S002C003'});
            tec.endTestCase();
            tec.endTestSuite();
            tec.startTestSuite({id: 'S003'});
            tec.startTestCase({id: 'S003C001'});
            tec.endTestCase();
            tec.endTestSuite();
            tec.endExecution();
            expect(tec.isExecutionStarted()).toBeTruthy();
            expect(tec.isExecutionFinished()).toBeTruthy();
            expect(tec.duration).toEqual(expect.any(Number));
            expect(tec.testSuites).toEqual(arrayContaining([
                validContextEntity({id: 'S001'}), // S001
                validContextEntity({ // S002
                    id: 'S002',
                    testCases: arrayContaining([
                        validContextEntity({ // S002C001
                            id: 'S002C001',
                            testSteps: arrayContaining([
                                validContextEntity({
                                    id: 'late added',
                                    testActions: arrayContaining([
                                        validContextEntity({
                                            kind: 'action',
                                            id: 'Action'
                                        })
                                    ])
                                })
                            ])
                        }),
                        validContextEntity({
                            id: 'S002C002'
                        }),
                        validContextEntity({
                            id: 'S002C003'
                        }),
                    ])
                }),
                validContextEntity()
            ]))
        })


    });

    describe('negative', () => {
        it('should throw for duration request if execution is not finished', () => {
            tec.startExecution();
            expect(() => tec.duration).toThrow()
        });

        it('should throw when starting testsuite before execution', () => {
            expect(() => {
                tec.startTestSuite()
            }).toThrow()
        });

        it('should throw when starting testcase before testsuite is started', () => {
            tec.startExecution();
            expect(() => {
                tec.startTestCase()
            }).toThrow();
        });

        it('should throw when starting teststep before testcase is started', () => {
            tec.startExecution();
            tec.startTestSuite();
            expect(() => {
                tec.startTestStep()
            }).toThrow();
        });

        it('should throw if execution is ended before its started', () => {
            expect(() => tec.endExecution()).toThrow()
        });
    });
});
