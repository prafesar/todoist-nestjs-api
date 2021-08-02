import { DeleteResult, EntityRepository, InsertResult, Repository } from 'typeorm';


import { CommentEntity } from '../comments/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@EntityRepository(CommentEntity)
export class CommentsRepository extends Repository<CommentEntity> {
  
    async createComment(dto: CreateCommentDto): Promise<CommentEntity> {
      return this.create(dto)
    }

    async saveComment(comment: CommentEntity): Promise<CommentEntity> {
      return await this.save(comment)
    }

    async findCommentById(id: string): Promise<CommentEntity> {
      return await this.findOne(id, {
        relations: ['task', 'author']
      })
    }

    async removeCommentById(id: string): Promise<DeleteResult> {
      return await this.delete(id)
    }
}