import { TaskType } from "./task.type";

export interface TaskResponseInterface {
  task: TaskType & { authorId: string, projectId: string };
}