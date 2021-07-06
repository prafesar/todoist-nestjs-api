import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Comment } from 'src/comments/comment.entity';
import { CommentsRepository } from 'src/comments/comments.repository';
import { CreateCommentDto } from 'src/comments/dto/create-comment.dto';
import { UpdateCommentDto } from 'src/comments/dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsRepository)
    private readonly commentsRepository: CommentsRepository,
  ){}

  async createComment(
    createCommentDto: CreateCommentDto
  ): Promise<Comment> {
    return this.commentsRepository.create({
      ...createCommentDto,
    })
  }

  async getCommentById(id: string): Promise<Comment> {
    const found = await this.commentsRepository.findOne(id);
    if (!found) {
      throw new NotFoundException(`Comment with ID: ${id} not found`);
    }
    return found;
  }

  async updateComment(id: string, commentDto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.commentsRepository.preload({
      id,
      ...commentDto,
    });
    if (!comment) {
      throw new NotFoundException(`Comment #${id} not found`)
    }
    return this.commentsRepository.save(comment);
  }

  async deleteCommentById(id: string): Promise<void> {
    const result = await this.commentsRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Comments with ID "${id}" not found`);
    }
  }

}


