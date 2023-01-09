import { AuthModule } from './auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Event } from './events/event.entity';
import { EventController } from './events/controllers/event.controller';
import { EventModule } from './event.module';
import { LoggerMiddleware } from './logger.middleware';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { Project } from './projects/project.entity';
import { ProjectController } from './projects/controllers/projects.controller';
import { ProjectUser } from './project-users/project-user.entity';
import { ProjectUserController } from './project-users/controllers/project-users.controller';
import { ProjectUserModule } from './project-user.module';
import { ProjectsModule } from './project.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { UsersController } from './users/controllers/user.controller';
import { UsersModule } from './users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User, Project, ProjectUser, Event],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    ProjectsModule,
    ProjectUserModule,
    EventModule,
    ScheduleModule.forRoot(),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(
        UsersController,
        ProjectController,
        EventController,
        ProjectUserController,
      );
  }
}
