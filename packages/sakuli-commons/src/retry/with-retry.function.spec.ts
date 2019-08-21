import {withRetry} from './with-retry.function';

describe('with-retry', () => {

    it('should invoke hanldeError for each rejected value', async () => {
        const handleError = jest.fn();
        const original = jest.fn()
            .mockRejectedValueOnce('Error')
            .mockRejectedValueOnce('Error')
            .mockRejectedValueOnce('Error')
            .mockResolvedValueOnce('Success')
        const applyRetry = withRetry(4, handleError);
        const result = await applyRetry(original, 5, '42');

        expect(handleError).toHaveBeenCalledTimes(3);
        expect(original).toHaveBeenCalledTimes(4);
        expect(original).toHaveBeenCalledWith(5, '42');
        expect(result).toBe('Success');
    })

    it('should throw after maximum retries', async () => {
        const handleError = jest.fn();
        const original = jest.fn()
            .mockRejectedValueOnce('Error')
            .mockRejectedValueOnce('Error')
            .mockRejectedValueOnce('Error')
            .mockResolvedValueOnce('Success')
        const applyRetry = withRetry(3, handleError);
        await expect(applyRetry(original, 5, '42')).rejects.toThrow();

    })

})
