import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
  UsePipes,
  ValidationPipe,
  Body,
  ParseUUIDPipe,
  NotFoundException,
  Injectable,
  Scope,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from '../../auth/guards/local-auth.guard';
import { AuthService } from '../../auth/services/auth.services';
import { CreateUserDto, LoginUserDto } from '../dto/user.dto';
import { UsersServices } from '../services/user.service';

@Controller('users')
export class UsersController {
  constructor(
    private userServices: UsersServices,
    private authService: AuthService,
  ) {}

  @UsePipes(ValidationPipe)
  @Post('auth/sign-up')
  async signup(@Body() createUserDto: CreateUserDto): Promise<CreateUserDto> {
    return await this.userServices.createUser(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Body() loginUserDto: LoginUserDto) {
    if (
      this.authService.validateUser(loginUserDto.email, loginUserDto.password)
    ) {
      return this.authService.login(
        await this.userServices.findByEmail(loginUserDto.email),
      );
    }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getSelfData(@Request() req) {
    return req.user;
  }

  @Get(':id')
  async getUserById(@Param('id', new ParseUUIDPipe()) id: string) {
    let user = await this.userServices.getUserById(id);
    if (user) {
      return user;
    } else {
      throw new NotFoundException();
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getUsers() {
    return this.userServices.getUsers();
  }
}
