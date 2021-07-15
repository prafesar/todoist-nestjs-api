import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TasksController } from './tasks.controller';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';
import { CommentsModule } from '../comments/comments.module';
import { CommentEntity } from '../comments/comment.entity';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TasksRepository, CommentEntity]),
    CommentsModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
    UsersModule,
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService]
})

export class TasksModule {}
