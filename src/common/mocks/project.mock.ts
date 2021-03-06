import { CreateProjectDto } from "../../projects/dto/create-project.dto";
import { ProjectEntity } from "../../projects/project.entity";
import { mockUser } from "./user.mock";

const projectDto: CreateProjectDto = {
  title: 'My Test Project',
};

const mockProjectEmptyUsers = Object.assign(
  new ProjectEntity(),
  projectDto,
);
const mockProject = Object.assign(mockProjectEmptyUsers, { users: [ mockUser ]});

const mockProjectRepository = () => ({
  getProjectById: jest.fn(),
  getProjects: jest.fn(),
});

const mockProjectService = {
  getProjects: jest.fn(),
  createProject: jest.fn(),
  getProjectById: jest.fn(),
  addTaskInProject: jest.fn(),
  deleteProject: jest.fn(),
  updateProjectStatus: jest.fn(),
  addUserInProject: jest.fn(),
  removeUserFromProject: jest.fn(),
  buildProjectResponse: jest.fn()
};

export {
  mockProjectService,
  mockProjectRepository,
  mockProject,
  mockProjectEmptyUsers
};