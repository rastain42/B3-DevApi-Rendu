import { Event } from './events/event.entity';
import { EventController } from './events/controllers/event.controller';
import { EventServices } from './events/services/event.service';
import { Module } from '@nestjs/common';
import { ProjectUserModule } from './project-user.module';
import { ProjectsModule } from './project.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
    UsersModule,
    ProjectUserModule,
    ProjectsModule,
  ],
  providers: [EventServices],
  controllers: [EventController],
  exports: [EventServices],
})
export class EventModule {}
