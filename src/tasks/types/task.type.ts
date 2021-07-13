import { TaskEntity } from "../task.entity";

export type TaskType = Omit<TaskEntity, 'project' | 'author' | 'comments'>;