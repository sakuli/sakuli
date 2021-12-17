export type Task = () => Promise<void>;

export * from "./ora-task.function";
export * from "./get-package-bootstrap-tasks.function";
export * from "./install-package-task.function";
export * from "./configure-feature-task.function";
export * from "./configuration-record.type";
