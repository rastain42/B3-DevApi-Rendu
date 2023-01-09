import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as weekOfYear from 'dayjs/plugin/weekOfYear';
import * as isBetween from 'dayjs/plugin/isBetween';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { ProjectUserServices } from '../../project-users/services/project-user.services';
import { Role } from '../../users/user.entity';
import { EventDto } from '../dto/event.dto';
import { EventStatus } from '../event.entity';
import { EventServices } from '../services/event.service';
import { UsersServices } from '../../users/services/user.service';
import { ProjectsServices } from '../../projects/services/projects.services';

dayjs.extend(weekOfYear);
dayjs.extend(isBetween);

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventController {
  constructor(
    private eventServices: EventServices,
    private projectUserServices: ProjectUserServices,
    private usersServices: UsersServices,
    private projectsServices: ProjectsServices,
  ) {}

  @Post()
  async postEvent(@Request() req, @Body() eventDto: EventDto) {
    const events = await this.eventServices.getEventsOfUser(req.user.userId);
    const filterDay = events.filter(
      (event) =>
        new Date(event.date).getDay() == new Date(eventDto.date).getDay(),
    );
    if (filterDay.length) throw new UnauthorizedException();
    const week = dayjs(eventDto.date).week();
    let count = 0;
    for (const event of events) {
      if (week == dayjs(event.date).week()) count++;
    }
    if (count >= 2) throw new UnauthorizedException();
    return await this.eventServices.createEvent(eventDto, req.user.userId);
  }

  @Get()
  async getEvents() {
    return await this.eventServices.getEvents();
  }

  @Get(':id')
  async getEvent(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.eventServices.getEventById(id);
  }

  private async validation(req, id: string) {
    const event = await this.eventServices.getEventById(id);
    if (event.eventStatus != EventStatus.PENDING)
      throw new BadRequestException();
    const projectUser =
      await this.projectUserServices.getAllProjectUserByUserID(event.userId);
    const user = await this.usersServices.findById(req.user.userId);
    for (const pUser of projectUser) {
      if (user.role == Role.PROJECTMANAGER) {
        const project = await this.projectsServices.getProjectById(
          pUser.projectId,
        );
        if (project.referringEmployeeId != user.id) {
          throw new UnauthorizedException();
        }
      }
    }
    const filter = projectUser.filter((pUser) =>
      dayjs(event.date).isBetween(pUser.startDate, pUser.endDate, 'day', '[]'),
    );
    if (!filter.length) throw new BadRequestException();
  }

  @Post(':id/validate')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.PROJECTMANAGER)
  async validateEvent(
    @Request() req,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    await this.validation(req, id);
    return await this.eventServices.validateEvent(id);
  }

  @Post(':id/decline')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.PROJECTMANAGER)
  async declineEvent(
    @Request() req,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    await this.validation(req, id);
    return await this.eventServices.declineEvent(id);
  }
}
