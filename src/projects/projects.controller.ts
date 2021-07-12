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

import { Project } from './project.entity';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { GetProjectsFilterDto } from './dto/get-projects-filter.dto';
import { UpdateProjectStatusDto } from './dto/update-project-status.dto';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { Task } from 'src/tasks/task.entity';
import { User } from 'src/users/user.entity';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { GetTasksFilterDto } from 'src/tasks/dto/get-tasks-filter.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('projects')
export class ProjectsController {
  constructor(
    private projectsService: ProjectsService,
  ) {}

  // only where current user
  @Get()
  @Roles(UserRole.USER)
  getProjects(@Query() filterDto: GetProjectsFilterDto): Promise<Project[]> {
    return this.projectsService.getProjects(filterDto);
  }

  // only if current user in project
  @Get('/:id')
  @Roles(UserRole.USER)
  async getProjectById( // with tasks
    @Param('id') id: string,
    @GetUser() currUser: User,
  ): Promise<Project> {
    const project: Project = await this.projectsService.getProjectById(id)
    const { users } = project;

    const userIsMissing = !users.some((user) => user.id === currUser.id)
    if (userIsMissing) {
      throw new HttpException('User is not in this project', HttpStatus.FORBIDDEN)
    }
    return project;
  }

  @Post()
  createProject(
    @Body() createProjectDto: CreateProjectDto,
    @GetUser() author: User,
  ): Promise<Project> {
    return this.projectsService.createProject(author, createProjectDto);
  }

  @Roles(UserRole.USER)
  @Post('/:id/tasks')
  async addTaskInProject(
    @Param('id') id: string,
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() currUser: User,
  ): Promise<Task> {
    const project: Project = await this.projectsService.getProjectById(id)
    const { users } = project;
    // only if current user in project
    const userIsMissing = !users.some((user) => user.id === currUser.id)
    if (userIsMissing) {
      throw new HttpException('User is not in this project', HttpStatus.FORBIDDEN)
    }
    return this.projectsService.addTaskInProject(id, currUser, createTaskDto);
  }

  @Post('/:id/users')
  addUserInProject(
    @Param('id') projectId: string,
    @Body('userId') userId: string,
  ): Promise<Project> {
    return this.projectsService.addUserInProject(projectId, userId);
  }

  @Delete('/:id')
  deleteProject(@Param('id') id: string): Promise<void> {
    return this.projectsService.deleteProject(id);
  }

  @Patch('/:id/status')
  updateProjectStatus(
    @Param('id') id: string,
    @Body() updateProject: UpdateProjectStatusDto,
  ): Promise<Project> {
    return this.projectsService.updateProjectStatus(id, updateProject);
  }

}
