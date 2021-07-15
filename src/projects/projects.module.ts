import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { ProjectsController } from './projects.controller';
import { ProjectsRepository } from './projects.repository';
import { ProjectsService } from './projects.service';
import { TasksModule } from '../tasks/tasks.module';
import { TaskEntity } from '../tasks/task.entity';
import { CommentEntity } from '../comments/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectsRepository, CommentEntity, TaskEntity]),
    TasksModule,
    AuthModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UsersModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
