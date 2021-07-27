import { TaskType } from "./task.type";

export interface TaskListResponseInterface {
    tasks: (TaskType & { authorId: string, projectId: string })[];
    count: number;
}