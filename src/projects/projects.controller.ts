import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ProjectEntity } from './project.entity';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { GetProjectsFilterDto } from './dto/get-projects-filter.dto';
import { UpdateProjectStatusDto } from './dto/update-project-status.dto';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { TaskEntity } from 'src/tasks/task.entity';
import { UserEntity } from 'src/users/user.entity';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GoogleAuthGuard } from 'src/auth/guards/google-auth.guard';
import { ProjectResponseInterface } from './types/project-response.interface';
import { TasksService } from 'src/tasks/tasks.service';
import { TaskResponseInterface } from 'src/tasks/types/task-response.interface';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('projects')
export class ProjectsController {
  constructor(
    private projectsService: ProjectsService,
    private readonly tasksService: TasksService,
  ) {}

  @Post()
  createProject(
    @Body() createProjectDto: CreateProjectDto,
    @GetUser() author: UserEntity,
  ): Promise<ProjectResponseInterface> {
    return this.projectsService.createProject(author, createProjectDto);
  }

  // list of projects
  @Roles(UserRole.USER)
  @Get()
  getProjects(
    @Query() filterDto: GetProjectsFilterDto,
  ): Promise<ProjectEntity[]> {
    return this.projectsService.getProjects(filterDto);
  }

  // only if user admin or current user in project
  @Roles(UserRole.USER)
  @Get('/:id')
  async getProjectById( // with tasks
    @Param('id') id: string,
    @GetUser() currUser: UserEntity,
  ): Promise<ProjectResponseInterface> {
    const project: ProjectEntity = await this.projectsService.getProjectById(id, currUser);
    return this.projectsService.buildProjectResponse(project)

  }
  
  @Roles(UserRole.USER)
  @Post('/:id/tasks')
  async addTaskInProject(
    @Param('id') id: string,
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() currUser: UserEntity,
  ): Promise<TaskResponseInterface> {
    const project: ProjectEntity = await this.projectsService.getProjectById(id, currUser)
    const task = await this.projectsService.addTaskInProject(project, currUser, createTaskDto);
    return this.tasksService.buildTaskResponse(task);
  }

  @Post('/:id/users')
  addUserInProject(
    @Param('id') projectId: string,
    @Body('userId') userId: string,
    @GetUser() currUser: UserEntity,
  ): Promise<ProjectEntity> {
    return this.projectsService.addUserInProject(projectId, userId, currUser);
  }

  @Delete('/:id')
  deleteProject(@Param('id') id: string): Promise<void> {
    return this.projectsService.deleteProject(id);
  }

  @Patch('/:id/status')
  updateProjectStatus(
    @Param('id') id: string,
    @Body() updateProject: UpdateProjectStatusDto,
  ): Promise<ProjectEntity> {
    return this.projectsService.updateProjectStatus(id, updateProject);
  }

}
