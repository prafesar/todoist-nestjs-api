import { Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';

import { CommentsService } from './comments.service';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../common/enums/user-role.enum';
import { Roles } from '../common/decorators/roles.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UserEntity } from '../users/user.entity';
import { DeleteResult } from 'typeorm';
import { CommentResponseInterface } from './types/comment-response.interface';

@UseGuards(RolesGuard)
@Roles(UserRole.USER)
@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
  ) {}

  @Get('/:id')
  async getComment(@Param('id') id: string): Promise<CommentResponseInterface> {
    const result = await this.commentsService.getCommentById(id);
    return this.commentsService.buildCommentResponse(result);
  }

  // only owner
  @Patch('/:id')
  async updateComment(
    @Param('id') id: string, 
    updateComment: UpdateCommentDto,
    @GetUser() currUser: UserEntity,
  ): Promise<CommentResponseInterface> {
    const result = await this.commentsService.updateComment(id, updateComment, currUser);
    return this.commentsService.buildCommentResponse(result);
  }

  @Roles(UserRole.ADMIN)
  @Delete('/:id')
  deleteComment(@Param('id') id: string): Promise<DeleteResult> {
    return this.commentsService.removeCommentById(id);
  }

}
