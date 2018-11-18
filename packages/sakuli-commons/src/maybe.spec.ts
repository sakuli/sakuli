import { isPresent, ifPresent, ensure, Maybe } from "./maybe";

describe('Maybe', () => {

    describe('isPresent', () => {
        it('should recognize null to be false', () => expect(isPresent(null)).toBeFalsy());
        it('should recognize undefined to be false', () => expect(isPresent(undefined)).toBeFalsy());
        it('should recognize NaN to be false', () => expect(isPresent(NaN)).toBeFalsy());
        it('should recognize 0 to be true', () => expect(isPresent(0)).toBeTruthy());
        it('should recognize empty string to be true', () => expect(isPresent('')).toBeTruthy());
        it('should recognize empty object to be true', () => expect(isPresent({})).toBeTruthy());
        it('should recognize empty array to be true', () => expect(isPresent([])).toBeTruthy());
    });

    
    describe('ifPresent', () => {
        
        it('should invoke then on present value', () => {
            const thenMock = jest.fn();
            const otherwiseMock = jest.fn();
            ifPresent('test', thenMock, otherwiseMock);
            expect(thenMock).toHaveBeenCalledWith('test');
            expect(otherwiseMock).toHaveBeenCalledTimes(0);
        })
        
        it('should ivoke thne on present value with no other parameter', () => {
            const thenMock = jest.fn();
            expect(ifPresent('test', thenMock)).toBeUndefined();
            expect(thenMock).toBeCalledWith('test')
        }) 
        
        it('should invoke otherwise on absent value', () => {
            const thenMock = jest.fn();
            const otherwiseMock = jest.fn();
            ifPresent(null, thenMock, otherwiseMock);
            expect(thenMock).toHaveBeenCalledTimes(0);
            expect(otherwiseMock).toHaveBeenCalledTimes(1);
        })
        
        it('should return result of otherwise producer', () => {
            expect(ifPresent(null,
                v => 'Present',
                () => 'Absent'
                )).toEqual('Absent')
            })
            
            it('should return result of then producer', () => {
                expect(ifPresent(2,
                    v => 2 * 2,
                    () => 0
                    )).toEqual(4)
                })
                
            })
            
    describe('ensure', () => {
        it('should return fallback on absent value', () => {
            expect(ensure(null, 'test')).toEqual('test')
        })

        it('should return fallback on absent value', () => {
            expect(ensure(<Maybe<string>>"present", 'test')).toEqual('present')
        })
    })
});
