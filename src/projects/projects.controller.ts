import {
  Body,
  Controller,
  Delete,
  Get,
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
import { GetUser } from 'src/users/get-user.decorator';
import { Task } from 'src/tasks/task.entity';
import { User } from 'src/users/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('projects')
@UseGuards(AuthGuard())
export class ProjectsController {
  constructor(
    private projectsService: ProjectsService,
  ) {}

  @Get()
  getProjects(@Query() filterDto: GetProjectsFilterDto): Promise<Project[]> {
    return this.projectsService.getProjects(filterDto);
  }

  @Get('/:id')
  getProjectById(@Param('id') id: string): Promise<Project> {
    return this.projectsService.getProjectById(id);
  }

  @Post()
  createProject(
    @Body() createProjectDto: CreateProjectDto,
    @GetUser() author: User,
  ): Promise<Project> {
    console.log('controller project, author: ', author);
    return this.projectsService.createProject(author, createProjectDto);
  }

  @Post('/:id/tasks')
  addTaskInProject(
    @Param('id') projectId: string,
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() author: User,
  ): Promise<Task> {
    return this.projectsService.addTaskInProject(projectId, author, createTaskDto);
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
