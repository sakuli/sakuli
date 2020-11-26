import { TestExecutionLifecycleHooks } from "./context-provider.interface";
import {
  lifecycleHookRegistry,
  LifecycleHookRegistryContent,
} from "./lifecycle-hook-registry";
import { Project } from "../loader/model";
import { TestExecutionContext } from "./test-execution-context";

describe("lifecycle hook registry", () => {
  const onProjectHook: TestExecutionLifecycleHooks = { onProject: jest.fn() };
  const beforeExecutionHook: TestExecutionLifecycleHooks = {
    beforeExecution: jest.fn(),
  };
  const afterExecutionHook: TestExecutionLifecycleHooks = {
    afterExecution: jest.fn(),
  };
  const readFileContentHook: TestExecutionLifecycleHooks = {
    readFileContent: jest.fn(),
  };
  const requestContextHook: TestExecutionLifecycleHooks = {
    requestContext: jest.fn(),
  };
  const beforeRunFileHook: TestExecutionLifecycleHooks = {
    beforeRunFile: jest.fn(),
  };
  const afterRunFileHook: TestExecutionLifecycleHooks = {
    afterRunFile: jest.fn(),
  };
  const onUnhandledErrorHook: TestExecutionLifecycleHooks = {
    onUnhandledError: jest.fn(),
  };
  const onSignalHook: TestExecutionLifecycleHooks = { onSignal: jest.fn() };

  const hookArray = [
    onProjectHook,
    beforeExecutionHook,
    afterExecutionHook,
    readFileContentHook,
    requestContextHook,
    beforeRunFileHook,
    afterRunFileHook,
    onUnhandledErrorHook,
    onSignalHook,
  ];

  it("should create registry from array", () => {
    //GIVEN
    const expectedHooks: LifecycleHookRegistryContent = {
      onProject: [onProjectHook],
      beforeExecution: [beforeExecutionHook],
      afterExecution: [afterExecutionHook],
      readFileContent: [readFileContentHook],
      requestContext: [requestContextHook],
      beforeRunFile: [beforeRunFileHook],
      afterRunFile: [afterRunFileHook],
      onUnhandledError: [onUnhandledErrorHook],
      onSignal: [onSignalHook],
    };

    //WHEN
    const hookRegistry = lifecycleHookRegistry(hookArray);

    //THEN
    let registeredHooks = hookRegistry.getRegisteredLifecycleHooks();
    expect(registeredHooks).toEqual(expectedHooks);
  });

  it("should accept classes extending TestExecutionLifecycleHooks", () => {
    //GIVEN
    const hook = new (class implements TestExecutionLifecycleHooks {
      onProject(
        project: Project,
        testExecutionContext: TestExecutionContext
      ): Promise<void> {
        return Promise.resolve();
      }
    })();

    const expectedHooks: LifecycleHookRegistryContent = {
      onProject: [hook],
      beforeExecution: [],
      afterExecution: [],
      readFileContent: [],
      requestContext: [],
      beforeRunFile: [],
      afterRunFile: [],
      onUnhandledError: [],
      onSignal: [],
    };

    //WHEN
    const hookRegistry = lifecycleHookRegistry([hook]);

    //THEN
    let registeredHooks = hookRegistry.getRegisteredLifecycleHooks();
    expect(registeredHooks).toEqual(expectedHooks);
  });

  it("should register all provided hooks", () => {
    //GIVEN
    const expectedHooks: LifecycleHookRegistryContent = {
      onProject: [onProjectHook, onProjectHook],
      beforeExecution: [beforeExecutionHook, beforeExecutionHook],
      afterExecution: [afterExecutionHook, afterExecutionHook],
      readFileContent: [readFileContentHook, readFileContentHook],
      requestContext: [requestContextHook, requestContextHook],
      beforeRunFile: [beforeRunFileHook, beforeRunFileHook],
      afterRunFile: [afterRunFileHook, afterRunFileHook],
      onUnhandledError: [onUnhandledErrorHook, onUnhandledErrorHook],
      onSignal: [onSignalHook, onSignalHook],
    };

    //WHEN
    const hookRegistry = lifecycleHookRegistry([...hookArray, ...hookArray]);

    //THEN
    let registeredHooks = hookRegistry.getRegisteredLifecycleHooks();
    expect(registeredHooks).toEqual(expectedHooks);
  });

  it("should return onProject hooks", () => {
    //GIVEN
    const expectedHooks = [onProjectHook];
    const hookRegistry = lifecycleHookRegistry(hookArray);

    //WHEN
    const hooks = hookRegistry.getOnProjectHooks();

    //THEN
    expect(hooks).toEqual(expectedHooks);
  });

  it("should return beforeExecution hooks", () => {
    //GIVEN
    const expectedHooks = [beforeExecutionHook];
    const hookRegistry = lifecycleHookRegistry(hookArray);

    //WHEN
    const hooks = hookRegistry.getBeforeExecutionHooks();

    //THEN
    expect(hooks).toEqual(expectedHooks);
  });

  it("should return afterExecution hooks", () => {
    //GIVEN
    const expectedHooks = [afterExecutionHook];
    const hookRegistry = lifecycleHookRegistry(hookArray);

    //WHEN
    const hooks = hookRegistry.getAfterExecutionHooks();

    //THEN
    expect(hooks).toEqual(expectedHooks);
  });

  it("should return readFileContent hooks", () => {
    //GIVEN
    const expectedHooks = [readFileContentHook];
    const hookRegistry = lifecycleHookRegistry(hookArray);

    //WHEN
    const hooks = hookRegistry.getReadFileContentHooks();

    //THEN
    expect(hooks).toEqual(expectedHooks);
  });

  it("should return requestContext hooks", () => {
    //GIVEN
    const expectedHooks = [requestContextHook];
    const hookRegistry = lifecycleHookRegistry(hookArray);

    //WHEN
    const hooks = hookRegistry.getRequestContextHooks();

    //THEN
    expect(hooks).toEqual(expectedHooks);
  });

  it("should return beforeRunFile hooks", () => {
    //GIVEN
    const expectedHooks = [beforeRunFileHook];
    const hookRegistry = lifecycleHookRegistry(hookArray);

    //WHEN
    const hooks = hookRegistry.getBeforeRunFileHooks();

    //THEN
    expect(hooks).toEqual(expectedHooks);
  });

  it("should return afterRunFile hooks", () => {
    //GIVEN
    const expectedHooks = [afterRunFileHook];
    const hookRegistry = lifecycleHookRegistry(hookArray);

    //WHEN
    const hooks = hookRegistry.getAfterRunFileHooks();

    //THEN
    expect(hooks).toEqual(expectedHooks);
  });

  it("should return onUnhandledError hooks", () => {
    //GIVEN
    const expectedHooks = [onUnhandledErrorHook];
    const hookRegistry = lifecycleHookRegistry(hookArray);

    //WHEN
    const hooks = hookRegistry.getOnUnhandledErrorHooks();

    //THEN
    expect(hooks).toEqual(expectedHooks);
  });

  it("should return onSignal hooks", () => {
    //GIVEN
    const expectedHooks = [onSignalHook];
    const hookRegistry = lifecycleHookRegistry(hookArray);

    //WHEN
    const hooks = hookRegistry.getOnSignalHooks();

    //THEN
    expect(hooks).toEqual(expectedHooks);
  });
});
