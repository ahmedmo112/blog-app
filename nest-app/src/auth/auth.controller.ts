import {
  Controller,
  Post,
  Body,
  UsePipes,
  Get,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { createUserSchema, userLoginSchema } from './schema/auth.zod-schema';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async create(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @Post('login')
  @UsePipes(new ZodValidationPipe(userLoginSchema))
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('users')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async getAllUsers(
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = 3,
  ) {
    return this.authService.getAllUsers(page, perPage);
  }
}
