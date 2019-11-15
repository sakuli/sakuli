import { EnterpriseAnswers, hasLicense } from "./enterprise-answers.interface";
import { FeatureChoices } from "./feature-choices.const";
import { oraTask, Task, getPackageBootstrapTasks } from "./tasks";
import { licenseGlobalTask } from "./tasks/license-tasks.function";
import { npmGlobalTask } from "./tasks/npm-global-task.function";

export const getBootstrapTasks = (answers: EnterpriseAnswers): Task[] => {
    const tasks: Task[] = [];

    if (hasLicense(answers)) {
        tasks.push(
            oraTask('Configure global npm token', npmGlobalTask(answers.npmKey!)),
            oraTask('Configure global license key', licenseGlobalTask(answers.npmKey!)
            )
        );
    }

    if (answers.features.includes(FeatureChoices.CheckMk)) {
        tasks.push(...getPackageBootstrapTasks(
            '@sakuli/forwarder-checkmk',
            {
                "sakuli.forwarder.check_mk.enabled": "true",
                "sakuli.forwarder.check_mk.spooldir": "/var/lib/check_mk_agent/spool",
                "sakuli.forwarder.check_mk.freshness": "600",
                "sakuli.forwarder.check_mk.spoolfile_prefix": "sakuli_suite",
                "sakuli.forwarder.check_mk.service_description": "${testsuite.id}",
                "sakuli.forwarder.check_mk.piggyback_hostname": "local",
                "sakuli.forwarder.check_mk.output.details": "true"
            }
        ))
    }

    if (answers.features.includes(FeatureChoices.CheckMk)) {
        tasks.push(...getPackageBootstrapTasks(
            '@sakuli/forwarder-gearman',
            {
                "sakuli.forwarder.gearman.enabled": "true",
                "sakuli.forwarder.gearman.encryption": "true",
                "sakuli.forwarder.gearman.secret.key": "secret-password",
                "sakuli.forwarder.gearman.server.host": "",
                "sakuli.forwarder.gearman.server.port": "4730",
                "sakuli.forwarder.gearman.server.queue": "check_results"
            }
        ))
    }

    if (answers.features.includes(FeatureChoices.CheckMk)) {
        tasks.push(...getPackageBootstrapTasks(
            '@sakuli/forwarder-icinga2',
            {
                "sakuli.forwarder.icinga2.enabled": "true",
                "sakuli.forwarder.icinga2.api.host": "",
                "sakuli.forwarder.icinga2.api.port": "5665",
                "sakuli.forwarder.icinga2.api.username": "",
                "sakuli.forwarder.icinga2.api.password": "",
                "sakuli.forwarder.icinga2.hostname": "",
                "sakuli.forwarder.icinga2.service_description": "${testsuite.id}",
                "sakuli.forwarder.icinga2.allow_insecure_connection": "false"
            }
        ))
    }

    return tasks;
}

