import { Test, TestingModule } from '@nestjs/testing';

import { UsersService } from '../users/users.service';
import { ProjectRepository } from './project.repository';
import { ProjectService } from './project.service';
import { TasksService } from '../tasks/tasks.service';
import { UserRole } from '../common/enums/user-role.enum';
import { UserEntity } from '../users/user.entity';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ProjectStatus } from './project-status.enum';
import { ProjectEntity } from './project.entity';

const mockProjectRepository = () => ({
  getProjectById: jest.fn(),
});

const mockTasksService = () => ({});
const mockUsersService = () => ({});


const userData = {
  id: 'userId',
  email: 'federal@fsb.ru',
  login: 'federal',
  password: 'password',
};

const mockUser = Object.assign(new UserEntity(), userData);
mockUser.role = UserRole.USER;

const mockAdmin = Object.assign(new UserEntity(), userData);
mockAdmin.role = UserRole.ADMIN;

const projectData = {
  id: 'projectId',
  title: 'My Test Project',
  status: ProjectStatus.OPEN,
  users: [],
};

const mockProjectEmptyUsers = Object.assign(new ProjectEntity(), projectData);
const mockProject = Object.assign(mockProjectEmptyUsers, { users: [ mockUser ]});

describe('ProjectService', () => {
  let projectService: ProjectService;
  let projectRepository;
  let tasksService: TasksService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
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

  describe('getProjectById', () => {
    it('user in project, return the result', async () => {
      projectRepository.getProjectById.mockResolvedValue(mockProject);
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
      expect(projectService.getProjectById('projectId', mockUser)).rejects.toThrow(NotFoundException);
    });

    it('user dont exist in project, handle Error', async () => {
      projectRepository.getProjectById.mockResolvedValue(mockProjectEmptyUsers);
      expect(projectService.getProjectById('projectId', mockUser)).rejects.toThrow(ForbiddenException);
    });

  })
});
