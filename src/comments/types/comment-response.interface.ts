import { CommentEntity } from "../comment.entity";

export interface CommentResponseInterface {
  comment: Omit<CommentEntity, 'author' | 'task'> & { authorId: string, taskId: string },
}