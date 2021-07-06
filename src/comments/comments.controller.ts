import { Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CommentsService } from './comments.service';
import { Comment } from 'src/comments/comment.entity';
import { UpdateCommentDto } from './dto/update-comment.dto';

@UseGuards(AuthGuard())
@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
  ) {}

  @Get('/:id')
  getComment(@Param('id') id: string): Promise<Comment> {
    return this.commentsService.getCommentById(id);
  }

  @Patch('/:id')
  updateComment(@Param('id') id: string, updateComment: UpdateCommentDto): Promise<Comment> {
    return this.commentsService.updateComment(id, updateComment);
  }

  @Delete('/:id')
  deleteComment(@Param('id') id: string): Promise<void> {
    return this.commentsService.deleteCommentById(id);
  }

}
