import { TestExecutionLifecycleHooks } from "./context-provider.interface";

export interface LifecycleHookRegistryContent {
  onProject: TestExecutionLifecycleHooks[];
  beforeExecution: TestExecutionLifecycleHooks[];
  afterExecution: TestExecutionLifecycleHooks[];
  readFileContent: TestExecutionLifecycleHooks[];
  requestContext: TestExecutionLifecycleHooks[];
  beforeRunFile: TestExecutionLifecycleHooks[];
  afterRunFile: TestExecutionLifecycleHooks[];
  onUnhandledError: TestExecutionLifecycleHooks[];
  onSignal: TestExecutionLifecycleHooks[];
}

export interface LifecycleHookRegistry {
  getRegisteredLifecycleHooks: () => LifecycleHookRegistryContent;
  getOnProjectHooks: () => TestExecutionLifecycleHooks[];
  getBeforeExecutionHooks: () => TestExecutionLifecycleHooks[];
  getAfterExecutionHooks: () => TestExecutionLifecycleHooks[];
  getReadFileContentHooks: () => TestExecutionLifecycleHooks[];
  getRequestContextHooks: () => TestExecutionLifecycleHooks[];
  getBeforeRunFileHooks: () => TestExecutionLifecycleHooks[];
  getAfterRunFileHooks: () => TestExecutionLifecycleHooks[];
  getOnUnhandledErrorHooks: () => TestExecutionLifecycleHooks[];
  getOnSignalHooks: () => TestExecutionLifecycleHooks[];
}

export function lifecycleHookRegistry(
  hooks: TestExecutionLifecycleHooks[]
): LifecycleHookRegistry {
  const registryContent: LifecycleHookRegistryContent = {
    onProject: [],
    beforeExecution: [],
    afterExecution: [],
    readFileContent: [],
    requestContext: [],
    beforeRunFile: [],
    afterRunFile: [],
    onUnhandledError: [],
    onSignal: [],
  };

  hooks.forEach((hook) => {
    for (const hookKey in hook) {
      switch (hookKey) {
        case "onProject":
          registryContent.onProject.push(hook);
          break;
        case "beforeExecution":
          registryContent.beforeExecution.push(hook);
          break;
        case "afterExecution":
          registryContent.afterExecution.push(hook);
          break;
        case "readFileContent":
          registryContent.readFileContent.push(hook);
          break;
        case "requestContext":
          registryContent.requestContext.push(hook);
          break;
        case "beforeRunFile":
          registryContent.beforeRunFile.push(hook);
          break;
        case "afterRunFile":
          registryContent.afterRunFile.push(hook);
          break;
        case "onUnhandledError":
          registryContent.onUnhandledError.push(hook);
          break;
        case "onSignal":
          registryContent.onSignal.push(hook);
          break;
      }
    }
  });

  return {
    getRegisteredLifecycleHooks: () => {
      return registryContent;
    },
    getOnProjectHooks: () => {
      return registryContent.onProject;
    },
    getBeforeExecutionHooks: () => {
      return registryContent.beforeExecution;
    },
    getAfterExecutionHooks: () => {
      return registryContent.afterExecution;
    },
    getReadFileContentHooks: () => {
      return registryContent.readFileContent;
    },
    getRequestContextHooks: () => {
      return registryContent.requestContext;
    },
    getBeforeRunFileHooks: () => {
      return registryContent.beforeRunFile;
    },
    getAfterRunFileHooks: () => {
      return registryContent.afterRunFile;
    },
    getOnUnhandledErrorHooks: () => {
      return registryContent.onUnhandledError;
    },
    getOnSignalHooks: () => {
      return registryContent.onSignal;
    },
  };
}
