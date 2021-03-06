import { ProjectType } from "./project.type";

export interface ProjectResponseInterface {
  project: ProjectType & { authorId: string };
  users: string[];
  tasks: string[];
}
