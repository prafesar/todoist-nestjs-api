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

import { ProjectEntity } from './project.entity';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { GetProjectsFilterDto } from './dto/get-projects-filter.dto';
import { UpdateProjectStatusDto } from './dto/update-project-status.dto';
import { CreateTaskDto } from '../tasks/dto/create-task.dto';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UserEntity } from '../users/user.entity';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProjectResponseInterface } from './types/project-response.interface';
import { ProjectListResponseInterfase } from './types/project-list-response.interface';
import { ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectsService: ProjectService) { }

  /**
   * Create new project
   */
  @Post()
  
  @ApiTags('Admin')
  async createProject(
    @Body('project') createProjectDto: CreateProjectDto,
    @GetUser() author: UserEntity,
  ): Promise<ProjectResponseInterface> {
    const project = await this.projectsService.createProject(author, createProjectDto);
    return this.projectsService.buildProjectResponse(project);
  }

  /**
   * Get list of projects
   */
  @Roles(UserRole.USER)
  @Get()
  async getProjects(
    @Query() filterDto: GetProjectsFilterDto = {},
  ): Promise<ProjectListResponseInterfase | []> {
    const projects = await this.projectsService.getProjects(filterDto);
    return this.projectsService.buildProjectListResponse(projects)
  }

  /**
   * Get project info by Id if user in project or is admin
   */
  @Roles(UserRole.USER)
  @Get('/:id')
  async getProjectById(
    @Param('id') id: string,
    @GetUser() currUser: UserEntity,
  ): Promise<ProjectResponseInterface> {
    const project = await this.projectsService.getProjectById(id, currUser);
    return this.projectsService.buildProjectResponse(project)
  }

  /**
   * Add task in project
   */
  @Roles(UserRole.USER)
  @Post('/:id/tasks')
  async addTaskInProject(
    @Param('id') id: string,
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() currUser: UserEntity,
  ): Promise<ProjectResponseInterface> {
    const result = await this.projectsService.addTaskInProject(id, currUser, createTaskDto)
    return this.projectsService.buildProjectResponse(result);
  }

  /**
   * Add user in project
   */
  @Post('/:id/users')
  @ApiTags('Admin')
  async addUserInProject(
    @Param('id') projectId: string,
    @Body('userId') userId: string,
    @GetUser() currUser: UserEntity,
  ): Promise<ProjectResponseInterface> {
    const project = await this.projectsService.addUserInProject(projectId, userId, currUser);
    return this.projectsService.buildProjectResponse(project)
  }

  /**
   * Remove user from project
   */
  @Delete('/:id/users')
  @ApiTags('Admin')
  async removeUserFromProject(
    @Param('id') projectId: string,
    @Body('userId') userId: string,
    @GetUser() currUser: UserEntity,
  ): Promise<void> {
    return await this.projectsService.removeUserFromProject(projectId, userId, currUser);
  }

  /**
   * Delete project
   */
  @Delete('/:id')
  @ApiTags('Admin')
  deleteProject(@Param('id') id: string): Promise<void> {
    return this.projectsService.deleteProject(id);
  }

  /**
   * Update project status
   */
  @Patch('/:id/status')
  @ApiTags('Admin')
  updateProjectStatus(
    @Param('id') id: string,
    @Body() updateProject: UpdateProjectStatusDto,
  ): Promise<ProjectEntity> {
    return this.projectsService.updateProjectStatus(id, updateProject);
  }

}
