import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectUserController } from './project-users/controllers/project-users.controller';
import { ProjectUser } from './project-users/project-user.entity';
import { ProjectUserServices } from './project-users/services/project-user.services';
import { ProjectsModule } from './project.module';
import { UsersModule } from './users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectUser]),
    UsersModule,
    ProjectsModule,
  ],
  providers: [ProjectUserServices],
  controllers: [ProjectUserController],
  exports: [ProjectUserServices],
})
export class ProjectUserModule {}
