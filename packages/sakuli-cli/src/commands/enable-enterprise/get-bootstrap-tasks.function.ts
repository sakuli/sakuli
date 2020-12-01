import { EnterpriseAnswers, hasLicense } from "./enterprise-answers.interface";
import { FeatureChoices } from "./feature-choices.const";
import {
  commentValue,
  configValue,
  getPackageBootstrapTasks,
  licenseGlobalTask,
  npmGlobalTask,
  oraTask,
  Task,
} from "./tasks";

export const getBootstrapTasks = (answers: EnterpriseAnswers): Task[] => {
  const tasks: Task[] = [];

  if (hasLicense(answers)) {
    tasks.push(
      oraTask(
        "Configure global npm token",
        npmGlobalTask(answers.npmKey || "")
      ),
      oraTask(
        "Configure global license key",
        licenseGlobalTask(answers.licenseKey || "")
      )
    );
  }

  if (answers.features.includes(FeatureChoices.CheckMk)) {
    tasks.push(
      ...getPackageBootstrapTasks("@sakuli/forwarder-checkmk", {
        "sakuli.forwarder.check_mk.enabled": configValue("true"),
        "sakuli.forwarder.check_mk.spooldir": commentValue(),
        "sakuli.forwarder.check_mk.freshness": commentValue(),
        "sakuli.forwarder.check_mk.spoolfile_prefix": commentValue(),
        "sakuli.forwarder.check_mk.service_description": commentValue(),
        "sakuli.forwarder.check_mk.piggyback_hostname": commentValue(),
        "sakuli.forwarder.check_mk.output.details": commentValue(),
      })
    );
  }

  if (answers.features.includes(FeatureChoices.OMD)) {
    tasks.push(
      ...getPackageBootstrapTasks("@sakuli/forwarder-gearman", {
        "sakuli.forwarder.gearman.enabled": configValue("true"),
        "sakuli.forwarder.gearman.server.host": configValue(),
        "sakuli.forwarder.gearman.server.port": commentValue(),
        "sakuli.forwarder.gearman.encryption": commentValue(),
        "sakuli.forwarder.gearman.secret.key": commentValue(),
        "sakuli.forwarder.gearman.server.queue": commentValue(),
      })
    );
  }

  if (answers.features.includes(FeatureChoices.Icinga2)) {
    tasks.push(
      ...getPackageBootstrapTasks("@sakuli/forwarder-icinga2", {
        "sakuli.forwarder.icinga2.enabled": configValue("true"),
        "sakuli.forwarder.icinga2.api.host": configValue(),
        "sakuli.forwarder.icinga2.api.username": configValue(),
        "sakuli.forwarder.icinga2.api.password": configValue(),
        "sakuli.forwarder.icinga2.hostname": configValue(),
        "sakuli.forwarder.icinga2.api.port": commentValue(),
        "sakuli.forwarder.icinga2.service_description": commentValue(),
        "sakuli.forwarder.icinga2.allow_insecure_connection": commentValue(),
      })
    );
  }

  if (answers.features.includes(FeatureChoices.Prometheus)) {
    tasks.push(
      ...getPackageBootstrapTasks("@sakuli/forwarder-prometheus", {
        "sakuli.forwarder.prometheus.enabled": configValue("true"),
        "sakuli.forwarder.prometheus.api.host": configValue(),
        "sakuli.forwarder.prometheus.api.port": configValue(),
        "sakuli.forwarder.prometheus.api.job": configValue(),
      })
    );
  }
  return tasks;
};
