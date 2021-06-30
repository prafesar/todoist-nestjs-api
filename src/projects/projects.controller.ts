import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { Project } from './project.entity';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { GetProjectsFilterDto } from './dto/get-projects-filter.dto';
import { UpdateProjectStatusDto } from './dto/update-project-status.dto';


@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  getProjects(@Query() filterDto: GetProjectsFilterDto): Promise<Project[]> {
    return this.projectsService.getProjects(filterDto);
  }

  @Get('/:id')
  getProjectById(@Param('id') id: string): Promise<Project> {
    return this.projectsService.getProjectById(id);
  }

  @Post()
  createProject(@Body() createProjectDto: CreateProjectDto): Promise<Project> {
    return this.projectsService.createProject(createProjectDto);
  }

  @Delete('/:id')
  deleteProject(@Param('id') id: string): Promise<void> {
    return this.projectsService.deleteProject(id);
    //TODO: remove all tasks in project
  }

  @Patch('/:id/status')
  updateProjectStatus(
    @Param('id') id: string,
    @Body() updateProjectStatusDto: UpdateProjectStatusDto,
  ): Promise<Project> {
    const { status } = updateProjectStatusDto;
    return this.projectsService.updateProjectStatus(id, status);
  }

}
