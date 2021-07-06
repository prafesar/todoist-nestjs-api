import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Project } from './project.entity';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { ProjectsRepository } from './projects.repository';
import { CreateProjectDto } from './dto/create-project.dto';
import { GetProjectsFilterDto } from './dto/get-projects-filter.dto';
import { TasksService } from 'src/tasks/tasks.service';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';
import { Task } from 'src/tasks/task.entity';
import { UpdateProjectStatusDto } from './dto/update-project-status.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectsRepository)
    private projectsRepository: ProjectsRepository,
    private tasksService: TasksService,
    private usersService: UsersService,
  ) {}

  getProjects(filterDto: GetProjectsFilterDto): Promise<Project[]> {
    return this.projectsRepository.getProjects(filterDto);
  }

  async getProjectById(id: string): Promise<Project> {
    const found = await this.projectsRepository.findOne(id);
    if (!found) {
      throw new NotFoundException(`Project with ID: ${id} not found`);
    }
    return found;
  }

  createProject(
    author: User,
    createProjectDto: CreateProjectDto,
  ): Promise<Project> {
    return this.projectsRepository.createProject(author, createProjectDto);
  }

  async addTaskInProject(
    projectId: string,
    user: User,
    createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    const project = await this.getProjectById(projectId);
    return this.tasksService.createTask(project, user, createTaskDto);
  }

  async deleteProject(id: string): Promise<void> {
    const result = await this.projectsRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }
  }

  async updateProjectStatus(id: string, updateProject: UpdateProjectStatusDto): Promise<Project> {
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

  async addUserInProject(id: string, userId: string): Promise<Project> {
    const newUser: User = await this.usersService.getUserById(userId);
    const project: Project = await this.getProjectById(id);
    const userAlreadyInProject: boolean = project.users.findIndex(user => user.id === userId) >= 0;
    if (userAlreadyInProject) {
      console.log((`User #${userId} already in project`));
      return;
    }
    const users: User[] = [...project.users, newUser];
    const updatedProject = await this.projectsRepository.preload({
      id,
      users,
    })
    if (!updatedProject) {
      throw new NotFoundException(`Project #${id} not found`);
    }
    return this.projectsRepository.save(updatedProject);
  }

}
