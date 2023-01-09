import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectUserDto } from '../dto/project-user.dto';
import { ProjectUser } from '../project-user.entity';
import * as dayjs from 'dayjs';
import * as isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

@Injectable()
export class ProjectUserServices {
  constructor(
    @InjectRepository(ProjectUser)
    private readonly projectUserRepository: Repository<ProjectUser>,
  ) {}

  async createProjectUser(projectUserDto: ProjectUserDto) {
    const projectUser = new ProjectUser();
    projectUser.startDate = projectUserDto.startDate;
    projectUser.endDate = projectUserDto.endDate;
    projectUser.userId = projectUserDto.userId;
    projectUser.projectId = projectUserDto.projectId;
    return await this.projectUserRepository.save(projectUser);
  }

  async getProjectUserByProjUserId(
    projectId: string,
    userId: string,
  ): Promise<ProjectUser> {
    return await this.projectUserRepository.findOneBy({ projectId, userId });
  }

  async getAllProjectUser(): Promise<ProjectUser[]> {
    return await this.projectUserRepository.find();
  }

  async getAllProjectUserByUserID(userId: string): Promise<ProjectUser[]> {
    return await this.projectUserRepository.findBy({ userId });
  }

  async getProjectUserForUserInDate(
    userId: string,
    date: Date,
  ): Promise<ProjectUser[]> {
    const allProjectUser = await this.getAllProjectUserByUserID(userId);
    return await Promise.all(
      allProjectUser.filter((puser) =>
        dayjs(date).isBetween(dayjs(puser.startDate), puser.endDate, 'd', '[]'),
      ),
    );
  }

  async getProjectUser(id: string): Promise<ProjectUser> {
    return await this.projectUserRepository.findOneBy({ id });
  }
}
