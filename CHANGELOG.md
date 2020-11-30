# Sakuli change log

All notable changes to this project will be documented in this file.

## Upcoming Release

- Enhancement: Improve error messages of assertion API [(507)](https://github.com/sakuli/sakuli/issues/507)
- Enhancement: Log "image located at" message on debug level [(#514)](https://github.com/sakuli/sakuli/issues/514)
- Epic: Redirect log information to stdout in CI/CD setup [(#402)](https://github.com/sakuli/sakuli/issues/402)
  - Enhancement: create log files even if log.mode is ci [(#508)](https://github.com/sakuli/sakuli/issues/508)
  - Enhancement: consume optional property to redirect log output to stdout as environment variable [(#495)](https://github.com/sakuli/sakuli/issues/495)
  - Enhancement: Disable cli output by property [(#493)](https://github.com/sakuli/sakuli/issues/493)
    - On the fly bugfix: Do not write to stream in `createClosableWriteStreamConsumer`, when stream has already been closed.
  - Enhancement: create logging consumer for stdout [(#494)](https://github.com/sakuli/sakuli/issues/494)
  - Enhancement: add std output mode property [(#502)](https://github.com/sakuli/sakuli/issues/502)
- Enhancement: npx sakuli decrypt [(#433)](https://github.com/sakuli/sakuli/issues/433)
- Enhancement: Added MultipleElementApi documentation [(#413)](https://github.com/sakuli/sakuli/issues/413)
- Enhancement: Control if Sakuli should create new browser sessions within Testsuite [(#260)](https://github.com/sakuli/sakuli/issues/260)
- Bugfix: Cryptic error message in case the image is too large [(#326)](https://github.com/sakuli/sakuli/issues/326)
- Enhancement: Release buttons on errors[(#379)](https://github.com/sakuli/sakuli/issues/379)
- Bugfix: Sakuli dies on executing empty test script [(#407)](https://github.com/sakuli/sakuli/issues/407)
- Bugfix: Throw exception if a TestCase is not initialized correctly [(#466)](https://github.com/sakuli/sakuli/issues/466)
- Bugfix: Inconsistent logging behavior on log.level=debug [(#376)](https://github.com/sakuli/sakuli/issues/376)
- Bugfix: stringToRegExp adds s* instead of \s* [(#468)](https://github.com/sakuli/sakuli/issues/468)
- Maintenance: fix rollup-plugin-node-resolve dependency [(#311)](https://github.com/sakuli/sakuli/issues/311)
- Bugfix: WebElement typing differs [(#528)](https://github.com/sakuli/sakuli/issues/528)
- Maintenance: update main build to node 14 [(#519)](https://github.com/sakuli/sakuli/issues/519)
- Feature: Add startStep to DSL [(#517)](https://github.com/sakuli/sakuli/issues/517)
  - This deprecates `testCase.endOfStep`
- Fux: Pull up timer fix from nut-js [(#544)](https://github.com/sakuli/sakuli/issues/544)
- Maintenance: Update minor dependency versions [(#525)](https://github.com/sakuli/sakuli/issues/525)
- Maintenance: Identify major dependency updates [(#524)](https://github.com/sakuli/sakuli/issues/524)
- Maintenance: Remove Node 10+12 builds [(#547)](https://github.com/sakuli/sakuli/issues/547)
- Maintenance: Rework CI/CD pipelines [(#548)](https://github.com/sakuli/sakuli/issues/548)

## v2.4.0

- Bugfix: \_highlight doesn't "null check" if a rect-object is obtained from element [(#434)](https://github.com/sakuli/sakuli/issues/343)
- Bugfix: Windows: env.type with capital letters leads to hanging shift key [(#430)](https://github.com/sakuli/sakuli/issues/430)
- Enhancement: Sakuli should gracefully exit on SIGINT and SIGTERM [(#424)](https://github.com/sakuli/sakuli/issues/424)
- Maintenance: Code Formatting [(#422)](https://github.com/sakuli/sakuli/issues/422)
- Enhancement: Wait for Scroll into view with Javascript [(#414)](https://github.com/sakuli/sakuli/pull/414)
- Bugfix: cannot find element with \_under/\_above/\_underOrAbove [(#395)](https://github.com/sakuli/sakuli/issues/395)
- Bugfix: nut.js: getRegionFromFocusedWindow(); returns whole display [(#390)](https://github.com/sakuli/sakuli/issues/390)
- Bugfix: Type Error for Environment type/typeMasked [(#387)](https://github.com/sakuli/sakuli/issues/387)
- Bugfix: Type Error for Application [(#386)](https://github.com/sakuli/sakuli/issues/386)
- Bugfix: Missing newlines in logfile [(#385)](https://github.com/sakuli/sakuli/issues/385)
- Enhancement: Update TypeScript version [(#362)](https://github.com/sakuli/sakuli/issues/362)
- Enhancement: Make screenshot folder structure configurable [(#340)](https://github.com/sakuli/sakuli/issues/340)
- Enhancement: Improve Logging [(#338)](https://github.com/sakuli/sakuli/issues/338)
- Enhancement: Cryptic error message in case that an image could not be found due to the similarity [(#325)](https://github.com/sakuli/sakuli/issues/325)
- Bugfix: Sakuli dies silently on syntax errors outside `try {} catch {}` [(#324)](https://github.com/sakuli/sakuli/issues/324)
- Bugfix: normaliseIdentifierString eliminating regex [(#318)](https://github.com/sakuli/sakuli/issues/318)
- Enhancement: Autodiscovery for presetprovider [(#276)](https://github.com/sakuli/sakuli/issues/276)
- Enhancement: Boilerplate in test-casefile when using create project [(#268)](https://github.com/sakuli/sakuli/issues/268)
- Enhancement: Configurable mouse speed [(#197)](https://github.com/sakuli/sakuli/issues/197)
- Bugfix: Native highlight throws error [(#167)](https://github.com/sakuli/sakuli/issues/167)
- Enhancement: pre-commit hooks for auto code formatting [(#125)](https://github.com/sakuli/sakuli/issues/125)

## v2.3.0

- Bugfix: Incomplete support for button elements [(#275)](https://github.com/sakuli/sakuli/issues/275)
- Enhancement: \_highlight doesn't "scroll intoview" [(#274)](https://github.com/sakuli/sakuli/issues/274)
- Bugfix: @sakuli/legacy-types are not published [(#253)](https://github.com/sakuli/sakuli/issues/253)
- Bugfix: `enable-typescript` command should install @sakuli packages with the same version as in project [(#254)](https://github.com/sakuli/sakuli/issues/254)
- Enhancement: Error Messages to CLI output in multiple testcase scenarios [(#234)](https://github.com/sakuli/sakuli/issues/234)
- Bugfix: Typescript is not installed when enabling typescript-support [(#255)](https://github.com/sakuli/sakuli/issues/255)
- Bugfix: Sakuli Container exists with exit code 0 if npm crashes early [(#279)](https://github.com/sakuli/sakuli/issues/279)
- Bugfix: getDriver from undefined exception [(#314)](https://github.com/sakuli/sakuli/issues/314)
- Bugfix: Solve "invalid session id" errors [(#313)](https://github.com/sakuli/sakuli/issues/313)
- Enhancement: node 12 support [(#266)](https://github.com/sakuli/sakuli/issues/266)
- Enhancement: Updated docs regarding node 12 [(#343)](https://github.com/sakuli/sakuli/issues/343)
- Bugfix: Clickable element covered from cookie banner after scroll into view is not clickable [(#332)](https://github.com/sakuli/sakuli/issues/332)
- Bugfix: Browser not closing on syntax error [(#335)](https://github.com/sakuli/sakuli/issues/335)
- Bugfix: Radio button not clicked [(#339)](https://github.com/sakuli/sakuli/pull/339)
- Enhancement: Improve Syntax error logging [(#341)](https://github.com/sakuli/sakuli/issues/341)
- Bugfix: No Types Available After Installing legacy-types [(#349)](https://github.com/sakuli/sakuli/issues/349)
- Enhancement: Improve performance during dom stabilization [(#355)](https://github.com/sakuli/sakuli/issues/355)
- Enhancement: Optionally disable validation prior to click actions [(#354)](https://github.com/sakuli/sakuli/issues/354)
- Bugfix: Declining in enable-typescript has no effect [(#305)](https://github.com/sakuli/sakuli/issues/305)
- Enhancement: Resolve crypto deprecation warnings [(#284)](https://github.com/sakuli/sakuli/issues/284)
- Bugfix: Program arguments are not applied when using `new Application` [(#309)](https://github.com/sakuli/sakuli/issues/309)
- Bugfix: Enable-typescript installs old typescript version [(#365)](https://github.com/sakuli/sakuli/issues/365)
- Bugfix: Cannot instantiate Region without parameters in a typescript test [(#359)](https://github.com/sakuli/sakuli/issues/359)
- Bugfix: Error messages from test failures are not propagated to CLI [(#353)](https://github.com/sakuli/sakuli/issues/353)
- Bugfix: `testsuite.warningTime` and `testsuite.criticalTime` do not affect suite result [(#371)](https://github.com/sakuli/sakuli/issues/371)

## v2.2.0

- Enhancement: Fetch Retry Performance [(#251)](https://github.com/sakuli/sakuli/issues/251)
- Enhancement: Add Typescript support [(#245)](https://github.com/sakuli/sakuli/issues/245)
- Enhancement: CLI - Sakuli enterprise project bootstrap [(#242)](https://github.com/sakuli/sakuli/issues/242)
- Enhancement: Enhance documentation for Action-API and Fetch-API [(#241)](https://github.com/sakuli/sakuli/issues/241)
- Enhancement: Add Apache License [(#240)](https://github.com/sakuli/sakuli/issues/240)
- Enhancement: Improve performance on element fetching [(#221)](https://github.com/sakuli/sakuli/issues/221)
- Enhancement: steps.cache mix up in testcases [(#204)](https://github.com/sakuli/sakuli/issues/204)
- Enhancement: Get rid of `done` function in testfiles [(#187)](https://github.com/sakuli/sakuli/issues/187)
- Bugfix: Add missing Assertion API [(#142)](https://github.com/sakuli/sakuli/issues/142)
- Enhancement: Switch between frames automatically [(#134)](https://github.com/sakuli/sakuli/issues/134)
- Bugfix: Highlight does not show red border around element [(#133)](https://github.com/sakuli/sakuli/issues/133)
- Bugfix: Firefox click not working on some elements [(#120)](https://github.com/sakuli/sakuli/issues/120)
- Enhancement: Add contribution guideline [(#39)](https://github.com/sakuli/sakuli/issues/39)
- Enhancement: Legacy testsuite generator [(#22)](https://github.com/sakuli/sakuli/issues/22)

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
- Bugfix: \_textbox ignores inputs without explicit type attribute [(#135)](https://github.com/sakuli/sakuli/issues/135)
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

- Bugfix: \_setValue doesnt delete previous values from element [(#82)](https://github.com/sakuli/sakuli/issues/82)
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
