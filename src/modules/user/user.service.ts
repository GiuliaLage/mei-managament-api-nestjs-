import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

import { RegisterUserDto } from './dtos/register-user.dto';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly respository: Repository<User>;

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.respository.findOneBy({
      email: email,
    });
    return user;
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.respository.findOneBy({ id });
    return user;
  }

  async registerUser(body: RegisterUserDto): Promise<User> {
    const { name, email, password } = body;

    const foundUser = await this.findUserByEmail(email);

    if (!foundUser) {
      const user = new User();
      user.name = name;
      user.email = email;
      user.password = password;

      const resgisteredUser = await this.respository.save(user);
      return resgisteredUser;
    }

    throw new HttpException(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'User already exists',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
