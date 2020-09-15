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
    if (hook.onProject) {
      registryContent.onProject.push(hook);
    }
    if (hook.beforeExecution) {
      registryContent.beforeExecution.push(hook);
    }
    if (hook.afterExecution) {
      registryContent.afterExecution.push(hook);
    }
    if (hook.readFileContent) {
      registryContent.readFileContent.push(hook);
    }
    if (hook.requestContext) {
      registryContent.requestContext.push(hook);
    }
    if (hook.beforeRunFile) {
      registryContent.beforeRunFile.push(hook);
    }
    if (hook.afterRunFile) {
      registryContent.afterRunFile.push(hook);
    }
    if (hook.onUnhandledError) {
      registryContent.onUnhandledError.push(hook);
    }
    if (hook.onSignal) {
      registryContent.onSignal.push(hook);
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
