import { EntityRepository, Repository } from 'typeorm';

import { ProjectEntity } from './project.entity';
import { ProjectStatus } from './project-status.enum';
import { CreateProjectDto } from './dto/create-project.dto';
import { GetProjectsFilterDto } from './dto/get-projects-filter.dto';
import { UserEntity } from '../users/user.entity';

@EntityRepository(ProjectEntity)
export class ProjectsRepository extends Repository<ProjectEntity> {
  // view list of projects
  async getProjects(
    filterDto: GetProjectsFilterDto
  ): Promise<ProjectEntity[]> {
    
    const { status, search } = filterDto;

    const query = this.createQueryBuilder('project');
    
    status && query.andWhere('project.status = :status', { status });
    
    if (search) {
      query.andWhere(
        'LOWER(project.title) LIKE LOWER(:search) OR LOWER(project.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    const projects = await query.getMany();
    return projects;
  }

  async createProject(
    author: UserEntity,
    createProjectDto: CreateProjectDto,
  ): Promise<ProjectEntity> {
    const project = this.create({
      ...createProjectDto,
      status: ProjectStatus.OPEN,
      author,
    });

    return await this.save(project);
  }

  async getProjectById( id: string ): Promise<ProjectEntity> {
    return this.findOne( id, {
      relations: ['author', 'users', 'tasks']
    });
  }

}
