import { AuthModule } from './auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { UsersController } from './users/controllers/user.controller';
import { UsersServices } from './users/services/user.service';
import { forwardRef, Module } from '@nestjs/common';

@Module({
  imports: [forwardRef(() => AuthModule), TypeOrmModule.forFeature([User])],
  providers: [UsersServices],
  controllers: [UsersController],
  exports: [UsersServices],
})
export class UsersModule {}
