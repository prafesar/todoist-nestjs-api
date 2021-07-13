import { ForbiddenException, HttpCode, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ProjectEntity } from './project.entity';
import { UserEntity } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { ProjectsRepository } from './projects.repository';
import { CreateProjectDto } from './dto/create-project.dto';
import { GetProjectsFilterDto } from './dto/get-projects-filter.dto';
import { TasksService } from 'src/tasks/tasks.service';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';
import { TaskEntity } from 'src/tasks/task.entity';
import { UpdateProjectStatusDto } from './dto/update-project-status.dto';
import { ProjectResponseInterface } from './types/project-response.interface';
import { threadId } from 'worker_threads';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/common/enums/user-role.enum';

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
    const found = await this.projectsRepository.findOne(id);
    if (!found) {
      throw new NotFoundException(`Project with ID: ${id} not found`);
    }
    const users = await found.users;
    const isUserInProject = users.some(user => user.id === currUser.id);
    
    if (!(currUser.role === UserRole.ADMIN) && !isUserInProject) {
      throw new ForbiddenException('access is closed')
    } 
    return found;
  }

  async createProject(
    author: UserEntity,
    createProjectDto: CreateProjectDto,
  ): Promise<ProjectResponseInterface> {
    const project = await this.projectsRepository.createProject(author, createProjectDto);
    return this.buildProjectResponse(project);
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

  // async addUserInProject(id: string, userId: string): Promise<ProjectEntity> {
  //   const newUser: UserEntity = await this.usersService.getUserById(userId);
  //   const project: ProjectEntity = await this.getProjectById(id);
  //   const userAlreadyInProject: boolean = project.users.findIndex(user => user.id === userId) >= 0;
  //   if (userAlreadyInProject) {
  //     console.log((`User #${userId} already in project`));
  //     return;
  //   }
  //   const users: UserEntity[] = [...project.users, newUser];
  //   const updatedProject = await this.projectsRepository.preload({
  //     id,
  //     users,
  //   })
  //   if (!updatedProject) {
  //     throw new NotFoundException(`Project #${id} not found`);
  //   }
  //   return this.projectsRepository.save(updatedProject);
  // }

  buildProjectResponse(project: ProjectEntity): ProjectResponseInterface {
    const { author, ...rest } = project;
    return {
      project: {
        ...rest,
        authorId: author.id,
      },
    };
  }
}
