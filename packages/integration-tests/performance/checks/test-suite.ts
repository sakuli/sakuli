export default async function (divCount: number) {
    const testCase = new TestCase(`Performance with ${divCount} divs`);
    try {
        await _navigateTo(`http://127.0.0.1:3000/${divCount}`);
        testCase.endOfStep('page-load')
        await _highlight(_div('div-82'));
        testCase.endOfStep('element-located')
    } catch (e) {
        await testCase.handleException(e);
    } finally {
        await testCase.saveResult();
    }
}
