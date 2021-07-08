import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Task } from 'src/tasks/task.entity';
import { Comment } from '../comments/comment.entity';
import { TasksModule } from 'src/tasks/tasks.module';
import { UsersModule } from 'src/users/users.module';

import { ProjectsController } from './projects.controller';
import { ProjectsRepository } from './projects.repository';
import { ProjectsService } from './projects.service';
import { PassportModule } from '@nestjs/passport';
import { JwtsModule } from 'src/jwts/jwts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectsRepository, Comment, Task]),
    TasksModule,
    AuthModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UsersModule,
    JwtsModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
