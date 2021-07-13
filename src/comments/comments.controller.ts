import { Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';

import { CommentsService } from './comments.service';
import { CommentEntity } from 'src/comments/comment.entity';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/common/enums/user-role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';

@UseGuards(RolesGuard)
@Roles(UserRole.USER)
@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
  ) {}

  @Get('/:id')
  getComment(@Param('id') id: string): Promise<CommentEntity> {
    return this.commentsService.getCommentById(id);
  }

  // only owner
  @Patch('/:id')
  updateComment(@Param('id') id: string, updateComment: UpdateCommentDto): Promise<CommentEntity> {
    return this.commentsService.updateComment(id, updateComment);
  }

  @Roles(UserRole.ADMIN)
  @Delete('/:id')
  deleteComment(@Param('id') id: string): Promise<void> {
    return this.commentsService.deleteCommentById(id);
  }

}
