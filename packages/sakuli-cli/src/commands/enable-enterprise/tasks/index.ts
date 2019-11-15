export type Task = () => Promise<void>;

export * from './ora-task.function';
export * from './get-package-bootstrap-tasks.function';
export * from './license-tasks.function';
export * from './npm-global-task.function';
export * from './install-package-task.function';
export * from './configure-feature-task.function'
