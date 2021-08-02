import { ProjectResponseInterface } from "./project-response.interface";

export interface ProjectListResponseInterfase {
  projects: ProjectResponseInterface[];
  count: number;
}