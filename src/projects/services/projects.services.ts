import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersServices } from '../../users/services/user.service';
import { Role } from '../../users/user.entity';
import { ProjectDto } from '../dto/project.dto';
import { Project } from '../project.entity';

@Injectable()
export class ProjectsServices {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly usersServices: UsersServices,
  ) {}

  async createProject(projectDto: ProjectDto) {
    const userRole = (
      await this.usersServices.findById(projectDto.referringEmployeeId)
    ).role;
    if (userRole == Role.ADMIN || userRole == Role.PROJECTMANAGER) {
      const project = new Project();
      project.name = projectDto.name;
      project.referringEmployeeId = projectDto.referringEmployeeId;
      return this.projectRepository.save(project);
    } else {
      throw new UnauthorizedException();
    }
  }

  async getProjectById(id: string): Promise<Project> {
    return this.projectRepository.findOneBy({ id });
  }

  async getProjects(): Promise<Project[]> {
    return await this.projectRepository.find();
  }
}
