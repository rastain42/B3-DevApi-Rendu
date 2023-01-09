import {
  Body,
  ConflictException,
  Controller,
  forwardRef,
  Get,
  Inject,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { ProjectsServices } from '../../projects/services/projects.services';
import { UsersServices } from '../../users/services/user.service';
import { Role } from '../../users/user.entity';
import { ProjectUserDto } from '../dto/project-user.dto';
import { ProjectUserServices } from '../services/project-user.services';
import * as dayjs from 'dayjs';
import * as isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

@Controller('project-users')
@UseGuards(JwtAuthGuard)
export class ProjectUserController {
  constructor(
    private projectsServices: ProjectsServices,
    private usersServices: UsersServices,
    private projectUserServices: ProjectUserServices,
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.PROJECTMANAGER)
  async postProjectUser(@Body() projectUserDto: ProjectUserDto) {
    const project = await this.projectsServices.getProjectById(
      projectUserDto.projectId,
    );
    if (!project) {
      throw new NotFoundException();
    }
    const user = await this.usersServices.getUserById(projectUserDto.userId);
    if (!user) {
      throw new NotFoundException();
    }
    const allProjectUser =
      await this.projectUserServices.getAllProjectUserByUserID(
        projectUserDto.userId,
      );
    for (const projectUser of allProjectUser) {
      if (
        dayjs(projectUserDto.startDate).isBetween(
          projectUser.startDate,
          projectUser.endDate,
          'day',
          '[)',
        ) ||
        dayjs(projectUserDto.endDate).isBetween(
          projectUser.startDate,
          projectUser.endDate,
          'day',
          '(]',
        )
      )
        throw new ConflictException();
    }
    return await this.projectUserServices.createProjectUser(projectUserDto);
  }

  @Get(':id')
  async getProjectUserId(
    @Request() req,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    const user = await this.usersServices.getUserById(req.user.userId);
    const projectUser = await this.projectUserServices.getProjectUser(id);
    if (user.role == Role.ADMIN || user.role == Role.PROJECTMANAGER) {
      return projectUser;
    } else {
      if (projectUser.userId == user.id) {
        return projectUser;
      } else {
        throw new NotFoundException();
      }
    }
  }

  @Get()
  async getProjectUser(@Request() req) {
    const role = (await this.usersServices.getUserById(req.user.userId)).role;
    if (role == Role.EMPLOYEE) {
      const all = await this.projectUserServices.getAllProjectUserByUserID(
        req.user.userId,
      );
      return all;
    } else {
      return await this.projectUserServices.getAllProjectUser();
    }
  }
}
