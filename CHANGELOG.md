# Sakuli change log

All notable changes to this project will be documented in this file.

## v2.1.3
- Bugfix: Sakuli Errors are not forwarded to log-file [(#232)](https://github.com/sakuli/sakuli/issues/232)
- Bugfix: Data object are not logged properly [(#230)](https://github.com/sakuli/sakuli/issues/230)
- Bugfix: Wrong log level for failing matches [(#227)](https://github.com/sakuli/sakuli/issues/227)
- Bugfix: Enable `sakuli.environment.similarity.default` property [(#223)](https://github.com/sakuli/sakuli/issues/223)
- Bugfix: Use subfolder for error screenshot [(#222)](https://github.com/sakuli/sakuli/issues/222)
- Bugfix: Wrong order for property loading [(#218)](https://github.com/sakuli/sakuli/issues/218)
- Enhancement: Configurable log and screenshot destination paths [(#205)](https://github.com/sakuli/sakuli/issues/205)
- Enhancement: Log levels [(#201)](https://github.com/sakuli/sakuli/issues/201)
- Enhancement: Configurable type delay [(#198)](https://github.com/sakuli/sakuli/issues/198)
- Bugfix: TestStepCache error handling [(#196)](https://github.com/sakuli/sakuli/issues/196)
- Bugfix: Change `yargs` from `devDependencies` to `dependencies` in `@sakuli/commons` [(#193)](https://github.com/sakuli/sakuli/issues/193)
- Enhancement: Add Error Messages to CLI output [(#177)](https://github.com/sakuli/sakuli/issues/177)
- Enhancement: Pure native testing without launching browser [(#171)](https://github.com/sakuli/sakuli/issues/171)
- Bugfix: ChromeOptions are not handled properly [(#166)](https://github.com/sakuli/sakuli/issues/166)
- Enhancement: Remove unused properties from `LegacyProjectProperties` class [(#146)](https://github.com/sakuli/sakuli/issues/146)

## v2.1.2
- Bugfix: Error screenshots on Windows not working [(#183)](https://github.com/sakuli/sakuli/issues/183)
- Bugfix: TeststepsCache should check for errors in current step [(#184)](https://github.com/sakuli/sakuli/issues/184)

## v2.1.1
- Enhancement: Publish API docs [(#57)](https://github.com/sakuli/sakuli/issues/57)
- Enhancement: Updated Sonar config [(#102)](https://github.com/sakuli/sakuli/issues/102)
- Bugfix: Wrong timestamp in log files [(#147)](https://github.com/sakuli/sakuli/issues/147)
- Enhancement: `forwardActionResult` is no longer a required method of `Forwarder` interface [(#148)](https://github.com/sakuli/sakuli/issues/148)
- Enhancement: Make template interpolation configurable [(#150)](https://github.com/sakuli/sakuli/issues/150)
- Enhancement: Snapshot releases with @next tag [(#155)](https://github.com/sakuli/sakuli/issues/155)
- Bugfix: TestExecutionContextRenderer blocks execution [(#174)](https://github.com/sakuli/sakuli/issues/174)
- Bugfix: Last Step is not reported when an error is thrown before `.endOfStep(...)` [(#178)](https://github.com/sakuli/sakuli/issues/178)
- Bugfix: BooleanProperties are not processed correctly [(#180)](https://github.com/sakuli/sakuli/issues/180)
- Bugfix: Warning and critical thresholds have no effect on TestCase [(#182)](https://github.com/sakuli/sakuli/issues/182)

## v2.1.0
- Enhancement: Provide TestExecutionContext to Forwarder [(#143)](https://github.com/sakuli/sakuli/issues/143)
- Bugfix: Missing possibility to configure masterkey via properties or CLI [(#138)](https://github.com/sakuli/sakuli/issues/138)
- Bugfix: _textbox ignores inputs without explicit type attribute [(#135)](https://github.com/sakuli/sakuli/issues/135)
- Bugfix: /usr/bin/env: ‘node --no-warnings’: No such file or directory [(#127)](https://github.com/sakuli/sakuli/issues/127)
- Maintenance: Remove Winston workaround [(#122)](https://github.com/sakuli/sakuli/issues/122)
- Bugfix: Testsuite UNNAMED [(#121)](https://github.com/sakuli/sakuli/issues/121)
- Enhancement: Declare Interfaces for Legacy API Modules [(#118)](https://github.com/sakuli/sakuli/issues/118)
- Bugfix: Dependency of get-cursor-position (@sakuli/cli) breaks npm install when python is not installed [(#117)](https://github.com/sakuli/sakuli/issues/117)
- Enhancement: Add configuration possibilities for WebDriver [(#114)](https://github.com/sakuli/sakuli/issues/114)
- Enhancement: Masked logging for clipboard and env var content [(#101)](https://github.com/sakuli/sakuli/issues/101)
- Enhancement: Case/Step/Command Reporting [(#93)](https://github.com/sakuli/sakuli/issues/93)
- Enhancement: Support for EL-like syntax in Property loader [(#51)](https://github.com/sakuli/sakuli/issues/51)

## v2.0.1

- Bugfix: _setValue doesnt delete previous values from element [(#82)](https://github.com/sakuli/sakuli/issues/82)
- Enhancement: Provide default node globals for tests execution [(#86)](https://github.com/sakuli/sakuli/issues/86)
- Bugfix: RegEx with indexes is broken [(#97)](https://github.com/sakuli/sakuli/issues/97)
- Bugfix: `mouseUp` and `mouseDown` methods non-functional on `Region` [(#105)](https://github.com/sakuli/sakuli/issues/105)
- Bugfix: getClipboard returns a Promise, log-output should be improved [(#99)](https://github.com/sakuli/sakuli/issues/99)
- Bugfix: Reduce Retry count in fetch-api methods [(#96)](https://github.com/sakuli/sakuli/issues/96)
- Bugfix: Click actions do not work with GeckoDriver [(#71)](https://github.com/sakuli/sakuli/issues/71)
- Enhancement: Code of conduct [(#38)](https://github.com/sakuli/sakuli/issues/38)
- Enhancement: Improved CLI output [(#64)](https://github.com/sakuli/sakuli/issues/64)
- Enhancement: Fluent async API [(#42)](https://github.com/sakuli/sakuli/issues/42)

## v2.0.0

- Initial version