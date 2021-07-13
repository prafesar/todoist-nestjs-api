import { EntityRepository, Repository } from 'typeorm';

import { UserEntity } from 'src/users/user.entity';
import { TaskEntity } from 'src/tasks/task.entity';
import { CommentEntity } from 'src/comments/comment.entity';
import { CreateCommentDto } from 'src/comments/dto/create-comment.dto';

@EntityRepository(CommentEntity)
export class CommentsRepository extends Repository<CommentEntity> {
  
}