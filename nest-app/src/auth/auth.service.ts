import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginUserDto } from './dto/login-user.dto';
import { hashSync, compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Errors } from 'src/Errors/error-messages';
import {
  PaginatedResult,
  PaginateFunction,
  paginator,
} from 'src/pagination/paginator';
import { User } from './entities/user.entity';

const paginate: PaginateFunction = paginator({ perPage: 3 });

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: createUserDto.email,
      },
    });

    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const newUser = this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashSync(createUserDto.password, 10),
        name: createUserDto.name,
        profile: {
          create: {
            bio: '',
          },
        },
      },
    });

    return newUser;
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: loginUserDto.email,
      },
    });

    if (!user) {
      throw new NotFoundException(Errors.UserNotFound);
    }

    if (!compareSync(loginUserDto.password, user.password)) {
      throw new UnauthorizedException(Errors.PasswordNotMatch);
    }

    const token = this.jwtService.sign({ userId: user.id, role: user.role });

    return { user, token };
  }

  async getAllUsers(
    page: number,
    perPage: number,
  ): Promise<PaginatedResult<User>> {
    return await paginate(this.prisma.user, {}, { page, perPage });
  }
}
