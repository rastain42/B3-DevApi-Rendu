import { Project } from './projects/project.entity';
import { ProjectController } from './projects/controllers/projects.controller';
import { ProjectUserModule } from './project-user.module';
import { ProjectsServices } from './projects/services/projects.services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users.module';
import { forwardRef, Module } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    UsersModule,
    forwardRef(() => ProjectUserModule),
  ],
  providers: [ProjectsServices],
  controllers: [ProjectController],
  exports: [ProjectsServices],
})
export class ProjectsModule {}
