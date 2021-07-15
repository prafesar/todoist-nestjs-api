import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ProjectEntity } from './project.entity';
import { UserEntity } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { ProjectRepository } from './project.repository';
import { CreateProjectDto } from './dto/create-project.dto';
import { GetProjectsFilterDto } from './dto/get-projects-filter.dto';
import { CreateTaskDto } from '../tasks/dto/create-task.dto';
import { TaskEntity } from '../tasks/task.entity';
import { UpdateProjectStatusDto } from './dto/update-project-status.dto';
import { ProjectResponseInterface } from './types/project-response.interface';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectRepository)
    private projectsRepository: ProjectRepository,
    private usersService: UsersService,
  ) {}

  getProjects(filterDto: GetProjectsFilterDto): Promise<ProjectEntity[]> {
    return this.projectsRepository.getProjects(filterDto);
  }

  async getProjectById(id: string, currUser: UserEntity): Promise<ProjectEntity> {
    const project = await this.projectsRepository.getProjectById(id)

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
    return await this.projectsRepository.createProject(author, dto);
  }

  async addTaskInProject(
    projectId: string,
    currUser: UserEntity,
    createTaskDto: CreateTaskDto,
  ): Promise<ProjectEntity> {
    const project = await this.getProjectById(projectId, currUser)
    const task = Object.assign(new TaskEntity(), createTaskDto, { author: currUser})
    project.tasks.push(task)
    return this.projectsRepository.saveProject(project);
  }

  async deleteProject(id: string): Promise<void> {
    return await this.projectsRepository.deleteProject(id);
  }

  async updateProjectStatus(id: string, { status }: UpdateProjectStatusDto): Promise<ProjectEntity> {
    const options = { id, status }
    const project = await this.projectsRepository.preloadProject(options)
    
    if (!project) {
      throw new NotFoundException(`Project #${id} not found`);
    }

    return this.projectsRepository.saveProject(project);
  }

  async addUserInProject(projectId: string, userId: string, currUser: UserEntity): Promise<ProjectEntity> {
    const project = await this.getProjectById(projectId, currUser)
    const user = await this.usersService.getUserById(userId);
    const userInProject = project.users.findIndex(user => user.id === userId) >= 0;
    
    if (userInProject) {
      throw new BadRequestException(`User #${userId} already in project`)
    }
    return await this.projectsRepository.addUserInProject(project, user);
  }

  async removeUserFromProject(
    projectId: string,
    userId: string,
    currUser: UserEntity
  ): Promise<ProjectEntity> {

    const project = await this.getProjectById(projectId, currUser)
    const user = await this.usersService.getUserById(userId);
    const userInProject = project.users.findIndex(user => user.id === userId) >= 0;
    
    if (!userInProject) {
      throw new BadRequestException(`User #${userId} dont exist in project`)
    }
    return await this.projectsRepository.removeUserFromProject(project, user);
  }

  buildProjectResponse(project: ProjectEntity): ProjectResponseInterface {
    const { author, tasks, users, ...rest } = project;
    return {
      project: {
        ...rest,
        authorId: author.id,
      },
      users: users.map(({ id }) => id),
      tasks: tasks.map(({ id }) => id),
    };
  }
}
