import { Injectable } from '@nestjs/common';
import { getManager, getRepository } from 'typeorm';
import { ProjectEntity } from './projects/project.entity';
import { UserEntity } from './users/user.entity';

@Injectable()
export class AppService {
  
  async getProjects(): Promise<any> {
    const manager = getManager();

    const proRepo = getRepository(ProjectEntity)
    
    const project = await proRepo
      .find({
        // select: ['id', 'title'],
        relations: ['tasks', 'author', 'users'],
      })
    
    return project.map(p => ({ task: p.tasks }))
  }

  
}
