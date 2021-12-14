import { ModuleAnswers } from "./module-answers.interface";
import { ModuleChoices } from "./module-choices.const";
import { commentValue, configValue, getPackageBootstrapTasks, Task, } from "./tasks";

export const getBootstrapTasks = (answers: ModuleAnswers): Task[] => {
  const tasks: Task[] = [];

  if (answers.features.includes(ModuleChoices.CheckMk)) {
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

  if (answers.features.includes(ModuleChoices.OMD)) {
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

  if (answers.features.includes(ModuleChoices.Icinga2)) {
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

  if (answers.features.includes(ModuleChoices.Prometheus)) {
    tasks.push(
      ...getPackageBootstrapTasks("@sakuli/forwarder-prometheus", {
        "sakuli.forwarder.prometheus.enabled": configValue("true"),
        "sakuli.forwarder.prometheus.api.host": configValue(),
        "sakuli.forwarder.prometheus.api.port": configValue(),
        "sakuli.forwarder.prometheus.api.job": configValue(),
      })
    );
  }

  if (answers.features.includes(ModuleChoices.OCR)) {
    tasks.push(...getPackageBootstrapTasks("@sakuli/ocr", {}));
  }

  return tasks;
};
