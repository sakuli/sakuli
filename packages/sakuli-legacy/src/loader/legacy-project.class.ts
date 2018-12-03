import { Project } from "@sakuli/core";
import { LegacyProjectProperties } from "./legacy-project-properties.class";

export interface LegacyProject extends Project {
    properties: LegacyProjectProperties;
}