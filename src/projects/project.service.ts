import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ProjectEntity } from './project.entity';
import { UserEntity } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { ProjectRepository } from './project.repository';
import { CreateProjectDto } from './dto/create-project.dto';
import { GetProjectsFilterDto } from './dto/get-projects-filter.dto';
import { CreateTaskDto } from '../tasks/dto/create-task.dto';
import { UpdateProjectStatusDto } from './dto/update-project-status.dto';
import { ProjectResponseInterface } from './types/project-response.interface';
import { ProjectListResponseInterfase } from './types/project-list-response.interface';
import { TasksService } from 'src/tasks/tasks.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectRepository)
    private projectRepository: ProjectRepository,
    private userService: UsersService,
    private taskService: TasksService,
  ) {}

  async getProjects(filterDto: GetProjectsFilterDto): Promise<ProjectEntity[]> {
    return await this.projectRepository.getFiltredProjectList(filterDto);
  }

  async getProjectById(id: string, currUser: UserEntity): Promise<ProjectEntity> {
    const project = await this.projectRepository.getProjectById(id)
    if (!project) {
      throw new NotFoundException('the project was not found');
    }
    
    const userInProject = project.users.some(({ id }) => id === currUser.id)
    
    if (!currUser.isAdmin() && !userInProject) {
      throw new ForbiddenException('access is denied');
    }

    return project;
  }

  async createProject(author: UserEntity, dto: CreateProjectDto): Promise<ProjectEntity> {
    return await this.projectRepository.createProject(author, dto);
  }

  async addTaskInProject(
    projectId: string,
    currUser: UserEntity,
    createTaskDto: CreateTaskDto,
  ): Promise<ProjectEntity> {
    const project = await this.getProjectById(projectId, currUser)
    const task = await this.taskService.createTask(project, currUser, createTaskDto)
    await this.projectRepository.addTaskInProject(project, task)
    return await this.getProjectById(projectId, currUser)
  }

  async deleteProject(id: string): Promise<void> {
    return await this.projectRepository.deleteProject(id);
  }

  async updateProjectStatus(id: string, { status }: UpdateProjectStatusDto): Promise<ProjectEntity> {
    const options = { id, status }
    const project = await this.projectRepository.preloadProject(options)
    
    if (!project) {
      throw new NotFoundException(`Project #${id} not found`);
    }

    return this.projectRepository.saveProject(project);
  }

  async addUserInProject(projectId: string, userId: string, currUser: UserEntity): Promise<ProjectEntity> {
    const project = await this.getProjectById(projectId, currUser)
    
    const user = await this.userService.getUserById(userId);
    const userInProject = project.users.findIndex(user => user.id === userId) >= 0;
    if (userInProject) {
      throw new BadRequestException(`User #${userId} already in project`)
    }
    await this.projectRepository.addUserInProject(project, user);
    return await this.getProjectById(projectId, currUser)
  }

  async removeUserFromProject(
    projectId: string,
    userId: string,
    currUser: UserEntity
  ): Promise<void> {

    const project = await this.getProjectById(projectId, currUser)
    const user = await this.userService.getUserById(userId);
    const userInProject = project.users.findIndex(user => user.id === userId) >= 0;
    
    if (!userInProject) {
      throw new BadRequestException(`User #${userId} dont exist in project`)
    }
    return await this.projectRepository.removeUserFromProject(project, user);
  }

  buildProjectResponse(project: ProjectEntity): ProjectResponseInterface {
    const { author: { id }, tasks, users, ...rest } = project;
    const report = {
      project: {
        ...rest,
        authorId: id,
      },
      users: users.map(({ id }) => id),
      tasks: tasks.map(({ id }) => id),
    };
    return report;
  }

  buildProjectListResponse(projects: ProjectEntity[]): ProjectListResponseInterfase | [] {
    if (!projects.length) {
      return [];
    }
    const result = projects.map(project => this.buildProjectResponse(project));
    return {
      projects: result,
      count: result.length,
    }
  }
}
