import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { ProjectController } from './project.controller';
import { ProjectRepository } from './project.repository';
import { ProjectService } from './project.service';
import { TasksModule } from '../tasks/tasks.module';
import { TaskEntity } from '../tasks/task.entity';
import { CommentEntity } from '../comments/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectRepository, CommentEntity, TaskEntity]),
    TasksModule,
    AuthModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UsersModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
