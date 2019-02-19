import {By} from "selenium-webdriver";
import {isChildOf} from "./is-child-of.function";
import {createTestEnv, TestEnvironment} from "../../__mocks__/create-test-env.function";
import {mockHtml} from "../../__mocks__";

jest.setTimeout(25_000);
describe('isChildOf', () => {
    let env: TestEnvironment;

    beforeEach(async done => {
        env = createTestEnv();
        await env.start();
        done();
    });

    afterEach(async done => {
        await env.stop();
        done();
    });


    it('should check that #del1 is child of table._in', async done => {
        const {driver} = await env.getEnv();
        await driver.get(mockHtml(`
          <table style="width:300px" class="_in">
              <tr>
                <td>Name</td>
                <td>Action</td>
                <td>ID</td>
              </tr>
              <tr>
                <td id="user-one">User One</td>
                <td id="del1"><a href="/deleteUser?id=1" onclick="return false">delete user one</a></td>
                <td>ID 1</td>
              </tr>
              <tr>
                <td id="user-two">User Two</td>
                <td id="del2"><a href="/deleteUser?id=2" onclick="return false">delete user two</a></td>
                <td>ID 2</td>
              </tr>
            </table>
        `));
        const table = await driver.findElement(By.css('table._in'));
        const del1 = await driver.findElement(By.css('#del1'));
        await expect(isChildOf(del1, table)).resolves.toBeTruthy();
        done();
    });

    it('should check that #del2 is not a child of #del1', async done => {
        const {driver} = await env.getEnv();
        await driver.get(mockHtml(`
            <table style="width:300px" class="_in">
              <tr>
                <td>Name</td>
                <td>Action</td>
                <td>ID</td>
              </tr>
              <tr>
                <td id="user-one">User One</td>
                <td id="del1"><a href="/deleteUser?id=1" onclick="return false">delete user one</a></td>
                <td>ID 1</td>
              </tr>
              <tr>
                <td id="user-two">User Two</td>
                <td id="del2"><a href="/deleteUser?id=2" onclick="return false">delete user two</a></td>
                <td>ID 2</td>
              </tr>
            </table>
        `));
        const del1 = await driver.findElement(By.css('#del1'));
        const del2 = await driver.findElement(By.css('#del2'));
        await expect(isChildOf(del2, del1)).resolves.toBeFalsy();
        done();
    });
});