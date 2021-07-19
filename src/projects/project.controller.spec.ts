import { Test, TestingModule } from '@nestjs/testing';

import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { mockUser } from '../common/mocks/user.mock';
import { mockProjectService} from '../common/mocks/project.mock';
import { ProjectStatus } from './project-status.enum';

describe('ProjectService', () => {
  let spyService: ProjectService;
  let controller: ProjectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [ProjectService],
    })
    .overrideProvider(ProjectService)
    .useValue(mockProjectService)
    .compile();

    spyService = module.get<ProjectService>(ProjectService);
    controller = module.get<ProjectController>(ProjectController);

  });

  it('call Service.getProjctById', async () => {
    controller.getProjectById('someId', mockUser);
    expect(spyService.getProjectById).toHaveBeenCalledWith('someId', mockUser);
  });

  it('call Service.getProjcts without params', async () => {
    controller.getProjects();
    expect(spyService.getProjects).toHaveBeenCalled();
  });

  it('call Service.getProjcts with params', async () => {
    controller.getProjects({ status: ProjectStatus.OPEN, search: 'asdf'});
    expect(spyService.getProjects).toHaveBeenCalledWith({ status: ProjectStatus.OPEN, search: 'asdf'});
  });

});
