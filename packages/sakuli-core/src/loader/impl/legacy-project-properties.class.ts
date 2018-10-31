import { JavaProperty } from "../properties/java-properties.decorator";
import { IsNotEmpty } from 'class-validator'

export class LegacyProjectProperties {
    /**
    *
    * Sakuli - Testing and Monitoring-Tool for Websites and common UIs.
    *
    * Copyright 2013 - 2015 the original author or authors.
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
    *
    * @formatter:off
    *####################################################################################
    *######################################################################################
    * All properties defined here are DEFAULT and should NOT be CHANGED.
    *
    * To define a specific behaviour to your test, it is possible to overwrite all properties of the Sakuli default
    * properties 'sakuli-default.properties'.
    * For a short guideline how the property replacement mechanism in Sakuli works and how properties should be
    * overwritten, please refer to https://github.com/ConSol/sakuli/blob/master/docs/manual/testdefinition/advanced-topics/sakuli-property-loading.adoc
    *######################################################################################
    *######################################################################################
    *######################################################################################
    * TEST-SUITE-META-PROPERTIES
    *
    * These properties describes the set of configuration for a test suite.
    *######################################################################################
    * The test suite ID is an unique ID, which identifies the same test suite
    * over all executions and configuration changes.
    * The 'testsuite.id' MUST be defined in the 'testsuite.properties'
    */
    @JavaProperty('testsuite.id')
    testsuiteId: string = ""

    /**
    *######################################################################################
    * OPTIONAL-PROPERTIES for the test suite
    *
    * If this properties haven NOT been set, the test suite will be configured with the
    * default values.
    *######################################################################################
    * Descriptive name for the current test suite
    * DEFAULT: value of 'testsuite.id'
    */
    @JavaProperty('testsuite.name')
    testsuiteName: string = ""

    /**
    * The warning runtime threshold (seconds) estimates the execution time of the complete
    * test suite. If the warning time is exceeded, the test suite will get the state
    * 'WARNING'.
    * If the threshold is set to 0, the execution time will never exceed, so the state will be always OK!
    * DEFAULT:0
    */
    @JavaProperty('testsuite.warningTime')
    testsuiteWarningTime: number = 0

    /**
    * The critical runtime threshold (seconds) estimates the execution time of the complete
    * test suite. If the critical time is exceeded, the test suite will get the state
    * 'CRITICAL'.
    * If the threshold is set to 0, the execution time will never exceed, so the state will be always OK!
    * DEFAULT:0
    */
    @JavaProperty('testsuite.criticalTime')
    testsuiteCriticalTime: number = 0

    /**
    * Defines the browser in witch the test suite should be executed
    * values are corresponding to the file
    * /userdata/config/browser_types.
    *
    * DEFAULT: firefox
    */
    @JavaProperty('testsuite.browser')
    testsuiteBrowser: string = "firefox"

    /**
    *######################################################################################
    * SAKULI-ACTION-PROPERTIES
    *
    * Common settings
    *######################################################################################
    * Similarity is taken as a "higher-than" value, that means for a match candidate region that more than
    *'sakuli.region.similarity.default' percent of the region's pixels must coincide. Decreasing this value should only be
    * necessary if the pattern images are of poor quality or the screen always differs slightly from the pattern images
    * (e.g. compression of remote sessions like vnc).
    *
    * DEFAULT: true
    */
    @JavaProperty('sakuli.environment.similarity.default')
    sakuliEnvironmentSimilarityDefault: number = 0.99

    /**
    * If true, the test suite takes screenshots when an error occurs during the execution.
    *
    * DEFAULT: true
    */
    @JavaProperty('sakuli.screenshot.onError')
    sakuliScreenshotOnError: boolean = true

    /**
    *## If true, every region gets highlighted automatically
    * en-/disable
    *
    * DEFAULT: false
    */
    @JavaProperty('sakuli.autoHighlight.enabled')
    sakuliAutoHighlightEnabled: boolean = false

    /**
    * Auto highlight duration (float)
    *
    * DEFAULT: 1.1f
    */
    @JavaProperty('sakuli.highlight.seconds')
    sakuliHighlightSeconds: number = 1.1

    /**
    *## Sikuli Action Delays
    *
    *set the default type and click delay in seconds;
    */
    @JavaProperty('sikuli.typeDelay')
    sikuliTypeDelay: number = 0

    /**
    
    */
    @JavaProperty('sikuli.clickDelay')
    sikuliClickDelay: number = 0.2

    /**
    *######################################################################################
    * ENCRYPTION-PROPERTIES
    *
    * Defines the properties how to en-/decrypt secrets
    * For more information see:
    * https://github.com/ConSol/sakuli/blob/master/docs/manual/testdefinition/advanced-topics/sakuli-encryption.adoc
    *######################################################################################
    *## Encryption Mode
    * Available modes are currently:
    * * "environment" using the environment variable `SAKULI_ENCRYPTION_KEY` (or if not present the property
    *   `sakuli.encryption.key`) as master key for encryption (default)
    * * "interface" using the host ethernet interface MAC address to encrypt a secret.
    *
    */
    @JavaProperty('sakuli.encryption.mode')
    sakuliEncryptionMode: string = "environment"

    /**
    *## Encryption environment Settings (sakuli.encryption.mode=environment)
    * Overwrite this property or us the environment var `SAKULI_ENCRYPTION_KEY` as master key for en- and decryption
    *
    *## Encryption environment Settings (sakuli.encryption.mode=environment_key)
    * Overwrite this property or us the environment var `SAKULI_ENCRYPTION_KEY` as master key for en- and decryption
    *
    */
    @JavaProperty('sakuli.encryption.key')
    sakuliEncryptionKey: string = ""

    /**
    *
    *
    *## Encryption Interface Settings (sakuli.encryption.mode=interface)
    * If this property is enabled, Sakuli will choose automatically the first ethernet interface for encryption.
    * To use a specific interface set it to 'false'
    *
    * DEFAULT:true
    */
    @JavaProperty('sakuli.encryption.interface.autodetect')
    sakuliEncryptionInterfaceAutodetect: boolean = true

    /**
    *
    * Defines a specific network interface which should be used for the encryption functions.
    * Therefore set the property 'sakuli.encryption.interface.autodetect=false'.
    *
    * Example: sakuli.encryption.interface=eth0
    */
    @JavaProperty('sakuli.encryption.interface')
    sakuliEncryptionInterface: string = ""

    /**
    *######################################################################################
    * FORWARDER-PROPERTIES
    *
    * Defines the properties for all forwarders. Currently supported: JDBC, Gearman/mod-gearman, Icinga, CheckMK.
    *######################################################################################
    * Set the default folder, where the Twig templates for the different forwarders are placed
    * (e.g. the Check_MK templates are placed in a subdirectory check_mk).
    * For more information about twig templates, please refer to http://jtwig.org/
    */
    @JavaProperty('sakuli.forwarder.template.folder')
    sakuliForwarderTemplateFolder: string = "${sakuli.home.folder}/config/templates"

    /**
    *#### GEARMAN - FORWARDER
    * Send results to a gearman-enabled monitoring system, using the parameters below in your 'sakuli.properties' to activate the forwarder.
    * For more information see https://github.com/ConSol/sakuli/blob/master/docs/forwarder-gearman.md
    *
    *# Gearman server settings:
    * DEFAULT: false
    */
    @JavaProperty('sakuli.forwarder.gearman.enabled')
    sakuliForwarderGearmanEnabled: boolean = false

    /**
    
    */
    @JavaProperty('sakuli.forwarder.gearman.server.host')
    sakuliForwarderGearmanServerHost: string = "changeme"

    /**
    * DEFAULT: 4730
    */
    @JavaProperty('sakuli.forwarder.gearman.server.port')
    sakuliForwarderGearmanServerPort: number = 4730

    /**
    * Nagios host where all Sakuli services are defined on. If necessary, overwrite this value per test suite.
    */
    @JavaProperty('sakuli.forwarder.gearman.nagios.hostname')
    sakuliForwarderGearmanNagiosHostname: string = "changeme"

    /**
    *
    *
    *## OPTIONAL GEARMAN PROPERTIES:
    * DEFAULT: check_results
    */
    @JavaProperty('sakuli.forwarder.gearman.server.queue')
    sakuliForwarderGearmanServerQueue: string = "check_results"

    /**
    *
    *# Encryption:
    * For serverside configuration see https://labs.consol.de/de/nagios/mod-gearman/index.html.
    */
    @JavaProperty('sakuli.forwarder.gearman.encryption')
    sakuliForwarderGearmanEncryption: boolean = true

    /**
    * ATTENTION: change the secret for production use!!!
    */
    @JavaProperty('sakuli.forwarder.gearman.secret.key')
    sakuliForwarderGearmanSecretKey: string = "sakuli_secret"

    /**
    *
    *# Result caching:
    * Caches results when gearman server is temporarily not available.
    */
    @JavaProperty('sakuli.forwarder.gearman.cache.enabled')
    sakuliForwarderGearmanCacheEnabled: boolean = true

    /**
    * Time in milliseconds to wait between result job submit (used when processing cached results)
    */
    @JavaProperty('sakuli.forwarder.gearman.job.interval')
    sakuliForwarderGearmanJobInterval: number = 1000

    /**
    *
    *# Nagios service options:
    * check_command gets appended to the perfdata string and will be used as PNP template name (check_sakuli = default)
    */
    @JavaProperty('sakuli.forwarder.gearman.nagios.check_command')
    sakuliForwarderGearmanNagiosCheck_command: string = "check_sakuli"

    /**
    * optional service description forwarded to nagios check result. DEFAULT: testsuite.id
    */
    @JavaProperty('sakuli.forwarder.gearman.nagios.service_description')
    sakuliForwarderGearmanNagiosService_description: string = "${testsuite.id}"

    /**
    *
    *# Result template:
    * Output message template strings. Change only if needed.
    */
    @JavaProperty('sakuli.forwarder.gearman.nagios.template.suite.summary')
    sakuliForwarderGearmanNagiosTemplateSuiteSummary: string = "{{state_short}} Sakuli suite \"{{id}}\" {{suite_summary}}. (Last suite run: {{stop_date}})"

    /**
    
    */
    @JavaProperty('sakuli.forwarder.gearman.nagios.template.suite.summary.maxLength')
    sakuliForwarderGearmanNagiosTemplateSuiteSummaryMaxLength: number = 200

    /**
    
    */
    @JavaProperty('sakuli.forwarder.gearman.nagios.template.suite.table')
    sakuliForwarderGearmanNagiosTemplateSuiteTable: string = "{{state_short}} Sakuli suite \"{{id}}\" {{suite_summary}}. (Last suite run: {{stop_date}}){{error_screenshot}}"

    /**
    
    */
    @JavaProperty('sakuli.forwarder.gearman.nagios.template.case.ok')
    sakuliForwarderGearmanNagiosTemplateCaseOk: string = "{{state_short}} case \"{{id}}\" ran in {{duration}}s - {{state_description}}"

    /**
    
    */
    @JavaProperty('sakuli.forwarder.gearman.nagios.template.case.warning')
    sakuliForwarderGearmanNagiosTemplateCaseWarning: string = "{{state_short}} case \"{{id}}\" over runtime ({{duration}}s/warn at {{warning_threshold}}s){{step_information}}"

    /**
    
    */
    @JavaProperty('sakuli.forwarder.gearman.nagios.template.case.warningInStep')
    sakuliForwarderGearmanNagiosTemplateCaseWarningInStep: string = "{{state_short}} case \"{{id}}\" over runtime ({{duration}}s/warn at {{warning_threshold}}s){{step_information}}"

    /**
    
    */
    @JavaProperty('sakuli.forwarder.gearman.nagios.template.case.critical')
    sakuliForwarderGearmanNagiosTemplateCaseCritical: string = "{{state_short}} case \"{{id}}\" over runtime ({{duration}}s/crit at {{critical_threshold}}s){{step_information}}"

    /**
    
    */
    @JavaProperty('sakuli.forwarder.gearman.nagios.template.case.error')
    sakuliForwarderGearmanNagiosTemplateCaseError: string = "{{state_short}} case \"{{id}}\" {{state_description}}: {{error_message}}{{error_screenshot}}"

    /**
    *# Screenshot dimensions in Gearman output
    */
    @JavaProperty('sakuli.forwarder.gearman.nagios.template.screenshotDivWidth')
    sakuliForwarderGearmanNagiosTemplateScreenshotDivWidth: number = 640

    /**
    *#### ICINGA2 - FORWARDER
    * Send results to a Icinga2 monitoring system, using the parameters below in your 'sakuli.properties' to activate the forwarder.
    * For more information see https://github.com/ConSol/sakuli/blob/master/docs/forwarder/icinga2.md
    *
    * DEFAULT: false
    */
    @JavaProperty('sakuli.forwarder.icinga2.enabled')
    sakuliForwarderIcinga2Enabled: boolean = false

    /**
    *# Icinga API settings
    */
    @JavaProperty('sakuli.forwarder.icinga2.api.host')
    sakuliForwarderIcinga2ApiHost: string = "changeme"

    /**
    
    */
    @JavaProperty('sakuli.forwarder.icinga2.api.port')
    sakuliForwarderIcinga2ApiPort: number = 5665

    /**
    
    */
    @JavaProperty('sakuli.forwarder.icinga2.api.username')
    sakuliForwarderIcinga2ApiUsername: string = "icinga-api-user"

    /**
    
    */
    @JavaProperty('sakuli.forwarder.icinga2.api.password')
    sakuliForwarderIcinga2ApiPassword: string = "icinga-api-password"

    /**
    * Icinga host with sakuli services
    */
    @JavaProperty('sakuli.forwarder.icinga2.hostname')
    sakuliForwarderIcinga2Hostname: string = "changeme"

    /**
    *
    *## OPTIONAL ICINGA2 PROPERTIES:
    * Icinga service description. DEFAULT: testsuite.id
    */
    @JavaProperty('sakuli.forwarder.icinga2.service_description')
    sakuliForwarderIcinga2Service_description: string = "${testsuite.id}"

    /**
    * REST-URL where to send the Icinga2 results
    */
    @JavaProperty('sakuli.forwarder.icinga2.api.url')
    sakuliForwarderIcinga2ApiUrl: string = "https://${sakuli.forwarder.icinga2.api.host}:${sakuli.forwarder.icinga2.api.port}/v1/actions/process-check-result?service"

    /**
    *
    *# Result template:
    *Icinga 'plugin_output' template strings. Change only if needed.
    */
    @JavaProperty('sakuli.forwarder.icinga2.template.suite.summary')
    sakuliForwarderIcinga2TemplateSuiteSummary: string = "{{state_short}} Sakuli suite \"{{id}}\" {{suite_summary}}. (Last suite run: {{stop_date}})"

    /**
    
    */
    @JavaProperty('sakuli.forwarder.icinga2.template.suite.summary.maxLength')
    sakuliForwarderIcinga2TemplateSuiteSummaryMaxLength: number = 200

    /**
    
    */
    @JavaProperty('sakuli.forwarder.icinga2.template.case.ok')
    sakuliForwarderIcinga2TemplateCaseOk: string = "{{state_short}} case \"{{id}}\" ran in {{duration}}s - {{state_description}}"

    /**
    
    */
    @JavaProperty('sakuli.forwarder.icinga2.template.case.warning')
    sakuliForwarderIcinga2TemplateCaseWarning: string = "{{state_short}} case \"{{id}}\" over runtime ({{duration}}s/warn at {{warning_threshold}}s){{step_information}}"

    /**
    
    */
    @JavaProperty('sakuli.forwarder.icinga2.template.case.warningInStep')
    sakuliForwarderIcinga2TemplateCaseWarningInStep: string = "{{state_short}} case \"{{id}}\" over runtime ({{duration}}s/warn at {{warning_threshold}}s){{step_information}}"

    /**
    
    */
    @JavaProperty('sakuli.forwarder.icinga2.template.case.critical')
    sakuliForwarderIcinga2TemplateCaseCritical: string = "{{state_short}} case \"{{id}}\" over runtime ({{duration}}s/crit at {{critical_threshold}}s){{step_information}}"

    /**
    
    */
    @JavaProperty('sakuli.forwarder.icinga2.template.case.error')
    sakuliForwarderIcinga2TemplateCaseError: string = "{{state_short}} case \"{{id}}\" {{state_description}}: {{error_message}}"

    /**
    *#### DATABASE - FORWARDER
    * Save results into database, using the DB connection parameters below (must be uncommented).
    * For more information see https://github.com/ConSol/sakuli/blob/master/docs/receivers/database.md
    * DEFAULT: false
    */
    @JavaProperty('sakuli.forwarder.database.enabled')
    sakuliForwarderDatabaseEnabled: boolean = false

    /**
    *# database host
    */
    @JavaProperty('sakuli.forwarder.database.host')
    sakuliForwarderDatabaseHost: string = "changeme"

    /**
    *# database port:
    */
    @JavaProperty('sakuli.forwarder.database.port')
    sakuliForwarderDatabasePort: number = 3306

    /**
    *# database name
    */
    @JavaProperty('sakuli.forwarder.database')
    sakuliForwarderDatabase: string = "sakuli"

    /**
    *# database username
    */
    @JavaProperty('sakuli.forwarder.database.user')
    sakuliForwarderDatabaseUser: string = "sakuli"

    /**
    *# database password
    */
    @JavaProperty('sakuli.forwarder.database.password')
    sakuliForwarderDatabasePassword: string = "sakuli"

    /**
    *# JDBC-Driver
    */
    @JavaProperty('sakuli.forwarder.database.jdbc.driverClass')
    sakuliForwarderDatabaseJdbcDriverClass: string = "com.mysql.jdbc.Driver"

    /**
    *# pattern for JDBC database connection URL
    */
    @JavaProperty('sakuli.forwarder.database.jdbc.url')
    sakuliForwarderDatabaseJdbcUrl: string = "jdbc:mysql://${sakuli.forwarder.database.host}:${sakuli.forwarder.database.port}/${sakuli.forwarder.database}"

    /**
    *#### CheckMK - FORWARDER
    * Send results to a CheckMK-enabled monitoring system, using the parameters below in your 'sakuli.properties' to activate the forwarder.
    * For more information see https://github.com/ConSol/sakuli/blob/master/docs/forwarder-checkmk.md
    *
    *# DEFAULT: false
    */
    @JavaProperty('sakuli.forwarder.check_mk.enabled')
    sakuliForwarderCheck_mkEnabled: boolean = false

    /**
    *
    *## OPTIONAL CheckMK PROPERTIES:
    *
    * spool dir, default /var/lib/check_mk_agent/spool (Linux) / (installation_path)\spool (Windows)
    */
    @JavaProperty('sakuli.forwarder.check_mk.spooldir')
    sakuliForwarderCheck_mkSpooldir: string = "/var/lib/check_mk_agent/spool"

    /**
    *  Max result age. Prepend this number on the file name, e.g. 600_sakuli_suite_XYZ
    */
    @JavaProperty('sakuli.forwarder.check_mk.freshness')
    sakuliForwarderCheck_mkFreshness: number = 600

    /**
    * Prefix of the file name for CheckMK
    */
    @JavaProperty('sakuli.forwarder.check_mk.spoolfile_prefix')
    sakuliForwarderCheck_mkSpoolfile_prefix: string = "sakuli_suite_"

    /**
    * optional service description forwarded to the output check result, when not set, testsuite.id is used
    */
    @JavaProperty('sakuli.forwarder.check_mk.service_description')
    sakuliForwarderCheck_mkService_description: string = "${testsuite.id}"

    /**
    *#### JSON - FORWARDER
    * Save results into a json file. The JSON forwarder is enabled per default.
    * DEFAULT: true
    */
    @JavaProperty('sakuli.forwarder.json.enabled')
    sakuliForwarderJsonEnabled: boolean = true

    /**
    *# folder where to save the json file on the test execution host
    */
    @JavaProperty('sakuli.forwarder.json.dir')
    sakuliForwarderJsonDir: string = "${sakuli.log.folder}/_json"

    /**
    *##############################
    * LOGGING & ERROR-SCREENSHOT PROPERTIES
    * Common logging settings for Sakuli.
    * (log verbosity can be set in 'sakuli-log-config.xml')
    *##############################
    *## Specific Logging properties for different logging levels
    *
    *## log levels for the different components - levels `DEBUG - INFO - WARN - ERROR`
    *logging level for Sakuli output
    */
    @JavaProperty('log.level.sakuli')
    logLevelSakuli: string = "INFO"

    /**
    *logging level for Sikuli output
    */
    @JavaProperty('log.level.sikuli')
    logLevelSikuli: string = "WARN"

    /**
    *logging level for Sahi output
    */
    @JavaProperty('log.level.sahi')
    logLevelSahi: string = "WARN"

    /**
    *logging level for the Spring framework (only used internally)
    */
    @JavaProperty('log.level.spring')
    logLevelSpring: string = "WARN"

    /**
    *logging level for all other **Java classes and libraries**
    */
    @JavaProperty('log.level.root')
    logLevelRoot: string = "INFO"

    /**
    * If you use the argument 'resumeOnException=true' in methods like `new Region("username",true)`
    * to continue the test even the method fails, you can control how Sakuli treats such exceptions by
    * settings the property `suppressResumedExceptions`:
    *   true  = the exception will be logged and appear in the test result
    *   false = the exception will NEITHER be logged NOR appear in the test result.
    *
    * Example:
    *              // create region "foo"
    *              var foo = new Region("bar.png",true);
    *              // if "image" is not found, the script will resume
    *              var baz = foo.find("image");
    *              // throw your "own" exception.
    *              // If you do not, and suppressResumedExceptions=true, the exception will be suppressed.
    *              if (baz == null){
    *                  throw "Sorry, I could not find image 'image'.";
    *              }
    *
    * DEFAULT: false
    */
    @JavaProperty('sakuli.exception.suppressResumedExceptions')
    sakuliExceptionSuppressResumedExceptions: boolean = false

    /**
    * Log pattern
    *
    * Log pattern for development with java classes:
    * sakuli.log.pattern=%-5level %d{YYYY-MM-dd HH:mm:ss.SSS} [%thread]  %logger{36} - %msg%n
    * default log pattern
    */
    @JavaProperty('sakuli.log.pattern')
    sakuliLogPattern: string = " %-5level [%d{YYYY-MM-dd HH:mm:ss.SSS}] - %msg%n"

    /**
    * log file folder
    */
    @JavaProperty('sakuli.log.folder')
    sakuliLogFolder: string = "${sakuli.testsuite.folder}/_logs"

    /**
    * Deletes all files that are older than the defined days in the folder `sakuli.log.folder`
    *
    * DEFAULT: 14 days
    */
    @JavaProperty('sakuli.log.maxAge')
    sakuliLogMaxAge: number = 14

    /**
    * folder for screenshot files (if activated)
    */
    @JavaProperty('sakuli.screenshot.dir')
    sakuliScreenshotDir: string = "${sakuli.log.folder}/_screenshots"

    /**
    * screenshot file format (Possible values: jpg, png)
    */
    @JavaProperty('sakuli.screenshot.format')
    sakuliScreenshotFormat: string = "png"

    /**
    *## URLs for documentation links
    */
    @JavaProperty('sahi.doc.base.url')
    sahiDocBaseUrl: string = "http://sahipro.com/docs/all-topics.html?q"

    /**
    
    */
    @JavaProperty('sakuli.doc.base.url')
    sakuliDocBaseUrl: string = "http://consol.github.io/sakuli/latest/index.html#"

    /**
    *######################################################################################
    * SAHI-SCRIPT-RUNNER-PROPERTIES
    *
    * Defines properties of the application component "Sahi".
    *######################################################################################
    *## Internal Sahi-Proxy configuration
    * sahi proxy port
    *(internal proxy for the test execution)
    */
    @JavaProperty('sahi.proxy.port')
    sahiProxyPort: number = 9999

    /**
    * Sahi installation folder
    */
    @JavaProperty('sahi.proxy.homePath')
    sahiProxyHomePath: string = "${sakuli.home.folder}/../sahi"

    /**
    * Sahi config folder
    */
    @JavaProperty('sahi.proxy.configurationPath')
    sahiProxyConfigurationPath: string = "${sahi.proxy.homePath}/userdata"

    /**
    * number of max. attempts to connect to a site before aborting
    */
    @JavaProperty('sahi.proxy.maxConnectTries')
    sahiProxyMaxConnectTries: number = 25

    /**
    * wait time in seconds between retry attempts
    */
    @JavaProperty('sahi.proxy.reconnectSeconds')
    sahiProxyReconnectSeconds: number = 1

    /**
    * amount of firefox profiles
    */
    @JavaProperty('ff.profiles.max_number')
    ffProfilesMax_number: number = 1

    /**
    *### Sahi customisations done by Sakuli only
    *
    * Sahi delays on Sikuli input (put on helmet!)
    *
    * Sikuli keyboard events (type/paste) on a Sahi-controlled browser instance can get lost if
    * they are executed at the same time when Sahi internal status requests are sent from the
    * browser JS to the Sahi proxy (default: 100ms = 10x per sec.).
    * For this reason, Sakuli can temporarily stop the browser JS with the Sahi proxy when a Sikuli
    * keyboard action has to be executed on the browser window.
    *
    * "delayPerKey" is the amount of time the browser JS keeps silent for one key event; for e.g. a
    * word with 8 characters, this is "8 x delayPerKey" (in ms).
    *
    * "delayBeforeInput" is the time Sakuli must wait before starting the keystrokes. Within this time
    * the browser JS updates its sync interval from default (100ms) to e.g. "8 x delayPerKey".
    *
    * After the key events are done, Sakuli resets Sahi's sync interval back to the default value.
    * This setting is not needed if key events are executed on a Window which is not contolled by Sahi.
    *
    * (gets only enabled if delayPerKey is set)
    */
    @JavaProperty('sahi.proxy.onSikuliInput.delayBeforeInput')
    sahiProxyOnSikuliInputDelayBeforeInput: number = 500

    /**
    
    */
    @JavaProperty('sahi.proxy.onSikuliInput.delayPerKey')
    sahiProxyOnSikuliInputDelayPerKey: string = ""

    /**
    *
    * Dis/Enable if Sahi should remove the authorization header.
    * See: http://consol.github.io/sakuli/latest/index.html#sahi-authorization-headers
    * (Default by Sahi OS: true)
    */
    @JavaProperty('sahi.proxy.removeAuthorizationHeader.enabled')
    sahiProxyRemoveAuthorizationHeaderEnabled: boolean = true

    /**
    *## HTTP/HTTPS proxy Settings
    *## Set a company proxy Sahi should use
    * external HTTP proxy
    */
    @JavaProperty('ext.http.proxy.enable')
    extHttpProxyEnable: boolean = false

    /**
    
    */
    @JavaProperty('ext.http.proxy.host')
    extHttpProxyHost: string = "proxy.server.com"

    /**
    
    */
    @JavaProperty('ext.http.proxy.port')
    extHttpProxyPort: number = 8080

    /**
    
    */
    @JavaProperty('ext.http.proxy.auth.enable')
    extHttpProxyAuthEnable: boolean = false

    /**
    
    */
    @JavaProperty('ext.http.proxy.auth.name')
    extHttpProxyAuthName: string = "user"

    /**
    
    */
    @JavaProperty('ext.http.proxy.auth.password')
    extHttpProxyAuthPassword: string = "password"

    /**
    * external HTTPS proxy
    */
    @JavaProperty('ext.https.proxy.enable')
    extHttpsProxyEnable: boolean = false

    /**
    
    */
    @JavaProperty('ext.https.proxy.host')
    extHttpsProxyHost: string = "proxy.server.com"

    /**
    
    */
    @JavaProperty('ext.https.proxy.port')
    extHttpsProxyPort: number = 8080

    /**
    
    */
    @JavaProperty('ext.https.proxy.auth.enable')
    extHttpsProxyAuthEnable: boolean = false

    /**
    
    */
    @JavaProperty('ext.https.proxy.auth.name')
    extHttpsProxyAuthName: string = "user"

    /**
    
    */
    @JavaProperty('ext.https.proxy.auth.password')
    extHttpsProxyAuthPassword: string = "password"

    /**
    * There is only one bypass list for both secure and insecure.
    */
    @JavaProperty('ext.http.both.proxy.bypass_hosts')
    extHttpBothProxyBypass_hosts: string = "localhost|127.0.0.1|*.internaldomain.com|www.verisign.com"

    /**
    *## SSL-Certificate settings (experimental)
    * Uncomment the following lines to use a client certificate.
    * If there is no password, do not uncomment the password line.
    * keystore type can be JKS, PKCS12 etc.
    * For more information see http://community.sahipro.com/forums/discussion/1167/sahi-allowing-certificates
    *
    *ssl.client.keystore.type=JKS
    *ssl.client.cert.path=${sakuli.testsuite.folder}/sakuli_keystore
    *ssl.client.cert.password=sakuli
    *## more logging options for Sahi:
    * log folder for sahi HTML report
    */
    @JavaProperty('logs.dir')
    logsDir: string = "${sakuli.log.folder}"

    /**
    * handlers to create in the root logger
    * (all loggers are children of the root logger)
    */
    @JavaProperty('handlers ')
    handlers: string = " java.util.logging.ConsoleHandler, java.util.logging.FileHandler"

    /**
    * default logging level for new ConsoleHandler instances
    */
    @JavaProperty('java.util.logging.ConsoleHandler.level ')
    javaUtilLoggingConsoleHandlerLevel: string = " ALL"

    /**
    * default logging level for new FileHandler instances
    */
    @JavaProperty('java.util.logging.FileHandler.level ')
    javaUtilLoggingFileHandlerLevel: string = " ALL"

    /**
    * default formatter for new ConsoleHandler instances
    */
    @JavaProperty('java.util.logging.ConsoleHandler.formatter ')
    javaUtilLoggingConsoleHandlerFormatter: string = " java.util.logging.SimpleFormatter"

    /**
    
    */
    @JavaProperty('java.util.logging.FileHandler.formatter ')
    javaUtilLoggingFileHandlerFormatter: string = " java.util.logging.SimpleFormatter"

    /**
    
    */
    @JavaProperty('java.util.logging.FileHandler.limit')
    javaUtilLoggingFileHandlerLimit: number = 102400

    /**
    
    */
    @JavaProperty('java.util.logging.FileHandler.count')
    javaUtilLoggingFileHandlerCount: number = 10

    /**
    
    */
    @JavaProperty('java.util.logging.FileHandler.pattern')
    javaUtilLoggingFileHandlerPattern: string = "%t/sahi%g.log"
}