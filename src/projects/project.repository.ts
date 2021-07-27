import { EntityRepository, Like, Repository } from 'typeorm';

import { ProjectEntity } from './project.entity';
import { ProjectStatus } from './project-status.enum';
import { CreateProjectDto } from './dto/create-project.dto';
import { GetProjectsFilterDto } from './dto/get-projects-filter.dto';
import { UserEntity } from '../users/user.entity';
import { NotFoundException } from '@nestjs/common';
@EntityRepository(ProjectEntity)
export class ProjectRepository extends Repository<ProjectEntity> {
  
  // view filtred list of projects
  async getFiltredProjectList(
    filterDto: GetProjectsFilterDto
  ): Promise<ProjectEntity[]> {
    let where = {};
    const relations = { relations: ['author', 'tasks', 'users']};
    const { status, search } = filterDto;
   
    if (search) {
      where = Object.assign( where, { title: Like(`%${search}%`)});
    }

    if (status) {
      where = Object.assign( where, { status });
    }

    const options = Object.assign(relations, { where })
    const projects = this.find(options);
    
    return projects ? projects : [];
  }

  async createProject(
    author: UserEntity,
    createProjectDto: CreateProjectDto,
  ): Promise<ProjectEntity> {
    const project = this.create({
      ...createProjectDto,
      status: ProjectStatus.OPEN,
      author,
      tasks: [],
      users: [],
    });

    return await this.save(project);
  }

  async getProjectById( id: string ): Promise<ProjectEntity> {
    return this.findOne( id, {
      relations: ['author', 'users', 'tasks']
    });
  }

  async deleteProject(id: string): Promise<void> {
    const result = await this.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }
  }

  async saveProject(project: ProjectEntity): Promise<ProjectEntity> {
    return this.save(project);
  }

  async preloadProject(options: object): Promise<ProjectEntity> {
    return this.preload(options);
  }

  async addUserInProject(project: ProjectEntity, user: UserEntity): Promise<void> {
    return await this.createQueryBuilder()
      .relation("users")
      .of(project)
      .add(user);
  }

  async removeUserFromProject(project: ProjectEntity, user: UserEntity): Promise<void> {
    
    return await this.createQueryBuilder()
      .relation('users')
      .of(project)
      .remove(user);
  }

}
