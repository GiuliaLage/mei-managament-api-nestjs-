import {
  Injectable,
  HttpStatus,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as Bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginRequestDto } from './dtos/login-request.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginRequestDto: LoginRequestDto): Promise<any> {
    const { email, password } = loginRequestDto;

    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const isPasswordCorrect = Bcrypt.compareSync(password, user.password);

    if (isPasswordCorrect) {
      delete user.password;
      return user;
    }

    throw new UnauthorizedException();
  }

  async login(user: any) {
    const payload = { email: user.email, name: user.name, id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
