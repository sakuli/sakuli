import {withRetry} from './with-retry.function';

describe('with-retry', () => {

    it('should invoke hanldeError for each rejected value', async () => {
        const bailOn = jest.fn();
        const original = jest.fn()
            .mockRejectedValueOnce('Error')
            .mockRejectedValueOnce('Error')
            .mockRejectedValueOnce('Error')
            .mockResolvedValueOnce('Success')
        const applyRetry = withRetry(4, bailOn);
        const result = await applyRetry(original, 5, '42');

        expect(bailOn).toHaveBeenCalledTimes(3);
        expect(original).toHaveBeenCalledTimes(4);
        expect(original).toHaveBeenCalledWith(5, '42');
        expect(result).toBe('Success');
    })

    it('should throw after maximum retries', async () => {
        const bailOn = jest.fn();
        const original = jest.fn()
            .mockRejectedValueOnce('Error')
            .mockRejectedValueOnce('Error')
            .mockRejectedValueOnce('Error')
            .mockResolvedValueOnce('Success')
        const applyRetry = withRetry(3, bailOn);
        await expect(applyRetry(original, 5, '42')).rejects.toThrow();
    })

    it('should bail retrying when `bailOn` fails even if retries left', async () => {
        console.log('Bail')
        const bailOn = jest.fn()
            .mockResolvedValueOnce(undefined)
            .mockRejectedValueOnce(Error('Bail'));
        const original = jest.fn()
            .mockRejectedValueOnce('Error')
            .mockRejectedValueOnce('Error')
            .mockRejectedValueOnce('Error')
            .mockResolvedValueOnce('Success');
        const applyRetry = withRetry(4, bailOn);
        await expect(applyRetry(original, 5, '42')).rejects.toThrow('Bail');
        expect(bailOn).toHaveBeenCalledWith('Error', original, 5, '42')
        expect(bailOn).toHaveBeenCalledTimes(2);

    })

})
