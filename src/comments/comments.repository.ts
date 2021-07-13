import { EntityRepository, Repository } from 'typeorm';

import { UserEntity } from 'src/users/user.entity';
import { Task } from 'src/tasks/task.entity';
import { Comment } from 'src/comments/comment.entity';
import { CreateCommentDto } from 'src/comments/dto/create-comment.dto';

@EntityRepository(Comment)
export class CommentsRepository extends Repository<Comment> {
  
}