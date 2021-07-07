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
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/user-role.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { GetTasksFilterDto } from 'src/tasks/dto/get-tasks-filter.dto';

@UseGuards(RolesGuard)
@Roles(UserRole.USER)
@Controller('projects')
export class ProjectsController {
  constructor(
    private projectsService: ProjectsService,
  ) {}

  // only where current user
  @Get()
  getProjects(@Query() filterDto: GetProjectsFilterDto): Promise<Project[]> {
    return this.projectsService.getProjects(filterDto);
  }

  // only where current user
  @Get('/:id')
  async getProjectById(@Param('id') id: string): Promise<Project> {
    // const project: Project = await this.projectsService.getProjectById(id);
    // const tasks: Task[] = await this.tasksService.getTasks(projectId);
    // const users: User[] = await this.usersService.getUsers()
    // return { project, users, tasks };
    return this.projectsService.getProjectById(id);
  }

  @Roles(UserRole.ADMIN)
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

  // @Get('/:id/tasks')
  // getTasksByProject(
  //   @Param('id') projectId: string,
  //   @Body() getTasksFilterDto: GetTasksFilterDto,
  //   @GetUser() user: User,
  // ): Promise<Task[]> {
  //   // check if project nav curr User
  //   // get task by  projectId 
  // }

  @Roles(UserRole.ADMIN)
  @Post('/:id/users')
  addUserInProject(
    @Param('id') projectId: string,
    @Body('userId') userId: string,
  ): Promise<Project> {
    return this.projectsService.addUserInProject(projectId, userId);
  }

  @Roles(UserRole.ADMIN)
  @Delete('/:id')
  deleteProject(@Param('id') id: string): Promise<void> {
    return this.projectsService.deleteProject(id);
  }

  @Roles(UserRole.ADMIN)
  @Patch('/:id/status')
  updateProjectStatus(
    @Param('id') id: string,
    @Body() updateProject: UpdateProjectStatusDto,
  ): Promise<Project> {
    return this.projectsService.updateProjectStatus(id, updateProject);
  }

}
