import { EntityRepository, Repository } from 'typeorm';


import { CommentEntity } from '../comments/comment.entity';

@EntityRepository(CommentEntity)
export class CommentsRepository extends Repository<CommentEntity> {
  
}