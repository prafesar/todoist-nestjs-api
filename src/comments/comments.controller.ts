import { Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';

import { CommentsService } from './comments.service';
import { Comment } from 'src/comments/comment.entity';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/users/user-role.enum';
import { Role } from 'src/auth/roles.decorator';

@UseGuards(RolesGuard)
@Role(UserRole.USER)
@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
  ) {}

  @Get('/:id')
  getComment(@Param('id') id: string): Promise<Comment> {
    return this.commentsService.getCommentById(id);
  }

  // only owner
  @Patch('/:id')
  updateComment(@Param('id') id: string, updateComment: UpdateCommentDto): Promise<Comment> {
    return this.commentsService.updateComment(id, updateComment);
  }

  @Role(UserRole.ADMIN)
  @Delete('/:id')
  deleteComment(@Param('id') id: string): Promise<void> {
    return this.commentsService.deleteCommentById(id);
  }

}
