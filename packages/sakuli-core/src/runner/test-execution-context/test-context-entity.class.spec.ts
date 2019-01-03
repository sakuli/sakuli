import {TestContextEntity, TestContextEntityKind} from "./test-context-entity.class";
import {TestContextEntityStates} from "./test-context-entity-state.class";
import {addSeconds} from 'date-fns';

describe('TestContextEntity', () => {

    class ClassUnderTest extends TestContextEntity {
        kind: TestContextEntityKind = 'step';

        constructor(private children: ClassUnderTest[] = []) {
            super();
        }

        getChildren(): TestContextEntity[] {
            return this.children;
        }
    }

    let cut: TestContextEntity;
    beforeEach(() => cut = new ClassUnderTest);

    describe('get state()', () => {

        it('should return error code if error is set', () => {
            cut.error = Error('some dummy error');
            expect(cut.state).toBe(TestContextEntityStates.ERROR)
        });

        it('should return critical even when warningtime is elapsed', () => {
            cut.warningTime = 10;
            cut.criticalTime = 15;
            cut.startDate = new Date;
            cut.endDate = addSeconds(cut.startDate, 20);
            expect(cut.state).toBe(TestContextEntityStates.CRITICAL)
        });

        it('should return warning when it is elapsed', () => {
            cut.warningTime = 10;
            cut.criticalTime = 20;
            cut.startDate = new Date;
            cut.endDate = addSeconds(cut.startDate, 15);
            expect(cut.state).toBe(TestContextEntityStates.WARNING)
        });

        it('should return ok when no error is set and duration is below critical and warning time', () => {
            cut.warningTime = 10;
            cut.criticalTime = 20;
            cut.startDate = new Date;
            cut.endDate = addSeconds(cut.startDate, 5);
            expect(cut.state).toBe(TestContextEntityStates.OK)
        })

        describe('get state with nested entites', () => {
            const withError = new ClassUnderTest();
            withError.error = Error('test');

            const isCritical = new ClassUnderTest();
            isCritical.warningTime = 10;
            isCritical.criticalTime = 15;
            isCritical.startDate = new Date;
            isCritical.endDate = addSeconds(isCritical.startDate, 20);

            const isWarning = new ClassUnderTest();
            isWarning.warningTime = 10;
            isWarning.criticalTime = 20;
            isWarning.startDate = new Date;
            isWarning.endDate = addSeconds(isWarning.startDate, 15);

            const isOk = new ClassUnderTest();
            isOk.warningTime = 10;
            isOk.criticalTime = 20;
            isOk.startDate = new Date;
            isOk.endDate = addSeconds(isOk.startDate, 5);

            it('should be a error if one nested child has errors', () => {
                const cut = new ClassUnderTest([
                    isOk, isOk, new ClassUnderTest([
                        isOk, withError, isCritical
                    ])
                ]);
                // make sure cut is 'ok'
                cut.warningTime = 10;
                cut.criticalTime = 20;
                cut.startDate = new Date;
                cut.endDate = addSeconds(cut.startDate, 5);

                expect(cut.state).toBe(TestContextEntityStates.ERROR)
            });

            it('should be a warning if one nested child has warning', () => {
                const cut = new ClassUnderTest([
                    isOk, isOk, new ClassUnderTest([
                        isOk, isWarning, isOk
                    ])
                ]);
                // make sure cut is 'ok'
                cut.warningTime = 10;
                cut.criticalTime = 20;
                cut.startDate = new Date;
                cut.endDate = addSeconds(cut.startDate, 5);

                expect(cut.state).toBe(TestContextEntityStates.WARNING)
            });
        })
    });

    describe("get duration", () => {

        it('should throw for duration before measurable is finished', () => {
            cut.startDate = new Date;
            expect(() => {
                const d = cut.duration
            }).toThrow()
        })


    });

    describe('isFinished / isStarted', () => {
        it('should mark an testexecutionentity as started but not finished', () => {
            cut.startDate = new Date;
            expect(cut.isFinished()).toBe(false);
            expect(cut.isStarted()).toBe(true);
        });

        it('should mark testexecutionentity as unstarted and unfinished if no start and enddate is set', () => {
            expect(cut.isFinished()).toBe(false);
            expect(cut.isStarted()).toBe(false);
        })
    });

    describe('isValid', () => {
        it('should be valid', async done => {
            cut.id = 'Test';
            cut.startDate = new Date();
            cut.endDate = addSeconds(new Date(), 10);
            const valid = await cut.isValid();
            expect(valid).toBe(true);
            done();
        });

        it('should be invalid when startDate is missing', async done => {
            cut.id = 'Test';
            cut.endDate = addSeconds(new Date(), 10);
            const valid = await cut.isValid();
            expect(valid).toBe(false);
            done();
        });

        it('should be invalid when endDate is missing', async done => {
            cut.id = 'Test';
            cut.startDate = new Date();
            const valid = await cut.isValid();
            expect(valid).toBe(false);
            done();
        });

        it('should be invalid when startDate is after endDate', async done => {
            cut.id = 'Test';
            cut.endDate = new Date();
            cut.startDate = addSeconds(new Date(), 10);
            const valid = await cut.isValid();
            expect(valid).toBe(false);
            done();
        })
    });


});
