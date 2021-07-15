import { ForbiddenException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection } from 'typeorm';

import { ProjectEntity } from './project.entity';
import { UserEntity } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { ProjectsRepository } from './projects.repository';
import { CreateProjectDto } from './dto/create-project.dto';
import { GetProjectsFilterDto } from './dto/get-projects-filter.dto';
import { TasksService } from '../tasks/tasks.service';
import { CreateTaskDto } from '../tasks/dto/create-task.dto';
import { TaskEntity } from '../tasks/task.entity';
import { UpdateProjectStatusDto } from './dto/update-project-status.dto';
import { ProjectResponseInterface } from './types/project-response.interface';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectsRepository)
    private projectsRepository: ProjectsRepository,
    private tasksService: TasksService,
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
    
    if (!currUser.isAdmin() && userInProject) {
      throw new ForbiddenException('access is denied');
    }

    return project;
  }

  async createProject(author: UserEntity, dto: CreateProjectDto): Promise<ProjectEntity> {
    return await this.projectsRepository.createProject(author, dto);
  }

  async addTaskInProject(
    project: ProjectEntity,
    user: UserEntity,
    createTaskDto: CreateTaskDto,
  ): Promise<TaskEntity> {
    return this.tasksService.createTask(project, user, createTaskDto);
  }

  async deleteProject(id: string): Promise<void> {
    const result = await this.projectsRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }
  }

  async updateProjectStatus(id: string, updateProject: UpdateProjectStatusDto): Promise<ProjectEntity> {
    const { status } = updateProject; 
    const project = status && await this.projectsRepository.preload({
      id,
      status
    })
    if (!project) {
      throw new NotFoundException(`Project #${id} not found`);
    }
    return this.projectsRepository.save(project);
  }

  async addUserInProject(id: string, userId: string, currUser: UserEntity): Promise<ProjectEntity> {
    const newUser: UserEntity = await this.usersService.getUserById(userId);
    const project: ProjectEntity = await this.getProjectById(id, currUser);
    
    const usersInProject = await project.users;
    const userInProject: boolean = usersInProject.findIndex(user => user.id === userId) >= 0;
    if (userInProject) {
      console.log((`User #${userId} already in project`));
      return;
    }
    
    // add newUser
    await getConnection()
    .createQueryBuilder()
    .relation(ProjectEntity, "users")
    .of(project)
    .add(newUser);

    return await this.getProjectById(id, currUser);
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
