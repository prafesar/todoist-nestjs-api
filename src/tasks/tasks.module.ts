import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TasksController } from './tasks.controller';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';
import { CommentsModule } from 'src/comments/comments.module';
import { Comment } from 'src/comments/comment.entity';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { JwtsModule } from 'src/jwts/jwts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TasksRepository, Comment]),
    CommentsModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
    UsersModule,
    JwtsModule,
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService]
})

export class TasksModule {}
