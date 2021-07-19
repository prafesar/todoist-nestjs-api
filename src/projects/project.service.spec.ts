import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { TasksService } from '../tasks/tasks.service';
import { mockTasksService } from '../common/mocks/task.mock';
import { mockAdmin, mockUser, mockUsersService } from '../common/mocks/user.mock';
import { ProjectService } from './project.service';
import { ProjectRepository } from './project.repository';
import {
  mockProjectEmptyUsers,
  mockProject,
  mockProjectRepository
} from '../common/mocks/project.mock';

describe('ProjectService', () => {
  let projectService: ProjectService;
  let projectRepository;
  let tasksService: TasksService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        { provide: ProjectRepository, useFactory: mockProjectRepository },
        { provide: TasksService, useFactory: mockTasksService },
        { provide: UsersService, useFactory: mockUsersService },
      ],
    }).compile();

    projectService = module.get<ProjectService>(ProjectService);
    projectRepository = module.get<ProjectRepository>(ProjectRepository);
    usersService = module.get<UsersService>(UsersService);
    tasksService = module.get<TasksService>(TasksService);

  });

  it('should be defined', () => {
    expect(projectService).toBeDefined();
  });

  describe('ProjectService.getProjectById', () => {
    it('user in project, return the result', async () => {
      projectRepository.getProjectById.mockImplementation(() => mockProject)
      const result = await projectService.getProjectById(null, mockUser)
      expect(result).toEqual(mockProject);
    });

    it('user not in project, but is Admin, return the result', async () => {
      projectRepository.getProjectById.mockResolvedValue(mockProjectEmptyUsers);
      const result = await projectService.getProjectById('projectId', mockAdmin)
      expect(result).toEqual(mockProjectEmptyUsers);
    });

    it('not found project, handle error', async () => {
      projectRepository.getProjectById.mockResolvedValue(null);
      expect(projectService.getProjectById('projectId', mockUser))
        .rejects.toThrow(NotFoundException);
    });

    it('user dont exist in project, handle Error', async () => {
      projectRepository.getProjectById.mockResolvedValue(mockProjectEmptyUsers);
      expect(projectService.getProjectById('projectId', mockUser))
        .rejects.toThrow(ForbiddenException);
    });
  })

});
