import { ProjectEntity } from "../project.entity";

export type ProjectType = Omit<ProjectEntity, 'tasks' | 'users' | 'author'>;
