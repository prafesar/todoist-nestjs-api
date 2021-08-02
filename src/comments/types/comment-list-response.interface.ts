import { CommentEntity } from "../comment.entity";

export interface CommentListResponseInterface {
  comments: (Omit<CommentEntity, 'author' | 'task'> & { authorId: string, taskId: string })[],
  count: number,
}