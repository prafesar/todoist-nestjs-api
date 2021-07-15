import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CommentEntity } from '../comments/comment.entity';
import { CommentsRepository } from '../comments/comments.repository';
import { CreateCommentDto } from '../comments/dto/create-comment.dto';
import { UpdateCommentDto } from '../comments/dto/update-comment.dto';
import { NotifyService } from '../notify/notify.service';
import { UserEntity } from '../users/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsRepository)
    private readonly commentsRepository: CommentsRepository,
    private readonly usersService: UsersService,
    private readonly notifyService: NotifyService,
  ){}

  async createComment(
    createCommentDto: CreateCommentDto,
  ): Promise<CommentEntity> {

    const comment = this.commentsRepository.create({
      ...createCommentDto,
    })
    // if mentioned, send reminder
    const { description } = comment;
    const mentionedUsers: Promise<UserEntity>[] = description
      .split(' ')
      .filter(word => word[0] === '@')
      .map(item => this.usersService.getUserByLogin(item.substring(1)))

    Promise.all(mentionedUsers)
      .then(users => users.forEach(({ email }) => {
        this.notifyService.sendLetter({ to: email, subject: '' , text: description});
      }))
    return comment;
  }

  async getCommentById(id: string): Promise<CommentEntity> {
    const found = await this.commentsRepository.findOne(id);
    if (!found) {
      throw new NotFoundException(`Comment with ID: ${id} not found`);
    }
    return found;
  }

  async updateComment(
    id: string,
    commentDto: UpdateCommentDto,
    currUser: UserEntity,
  ): Promise<CommentEntity> {
    // need check if owner
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


