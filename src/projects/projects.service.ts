import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Project } from './project.entity';
import { ProjectsRepository } from './projects.repository';
import { ProjectStatus } from './project-status.enum';
import { CreateProjectDto } from './dto/create-project.dto';
import { GetProjectsFilterDto } from './dto/get-projects-filter.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectsRepository)
    private projectsRepository: ProjectsRepository,
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

  createProject(createProjectDto: CreateProjectDto): Promise<Project> {
    return this.projectsRepository.createProject(createProjectDto);
    // TODO: need author ID
  }

  async deleteProject(id: string): Promise<void> {
    const result = await this.projectsRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }
  }

  async updateProjectStatus(id: string, status: ProjectStatus): Promise<Project> {
    const project = await this.getProjectById(id);

    project.status = status;
    await this.projectsRepository.save(project);

    return project;
  }

}
