/*
 * Sakuli - Testing and Monitoring-Tool for Websites and common UIs.
 *
 * Copyright 2013 - 2017 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

//_dynamicInclude($includeFolder);
import {isUpdateTimeBelowThresholdinMinutes} from "./check_time.js";
import {checkValuesInDiv, snowLines, temperatures} from "./check_content.js";

(async () => {

    var testCase = new TestCase(120, 150);
    var env = new Environment();

    try {
        await _navigateTo("https://wetter-light.asfinag.at", false, {
            user: 'Wetterlight',
            password: "!Wetter!"
        });
        testCase.endOfStep("login", 5, 10);

        var $lastUpdate = _div({className: "last-update"});
        await _highlight($lastUpdate);
        var dateString = await _getText($lastUpdate);
        isUpdateTimeBelowThresholdinMinutes(dateString, 30);
        testCase.endOfStep("check update time", 10, 20);

        var $snowLines = await snowLines();
        var $temperatures = await temperatures();

        await checkValuesInDiv($snowLines);
        await checkValuesInDiv($temperatures);

        testCase.endOfStep("check content", 80, 100);
    } catch (e) {
        testCase.handleException(e);
    } finally {
        testCase.saveResult();
    }
})().then(done);
