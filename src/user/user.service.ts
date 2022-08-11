import { Inject, Injectable, Scope } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Connection, Repository } from 'typeorm';

import { TENANT_CONNECTION } from '../tenant/tenant.provider';
import { CreateUserDto, ReadUserDto } from './dto';
import { User } from './entities/user.entity';
import { encodePassword } from 'src/utils/bcrypt';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  private readonly userRepository: Repository<User>;

  constructor(@Inject(TENANT_CONNECTION) connection: Connection) {
    this.userRepository = connection.getRepository(User);
  }

  /**
   * Get all users
   *
   * @returns all users in DTO object
   */
  async findAll(): Promise<ReadUserDto[]> {
    const users = await this.userRepository.find();
    return users.map((user) => plainToClass(ReadUserDto, user));
  }

  /**
   * Create a new user
   *
   * @param createUserDto user data to be created, which contain username, password and email
   * @returns
   */
  async create(createUserDto: CreateUserDto): Promise<ReadUserDto> {
    const password = await encodePassword(createUserDto.password);
    const createdUser = await this.userRepository.save({
      ...createUserDto,
      password,
    });
    return plainToClass(ReadUserDto, createdUser);
  }

  /**
   * Get one user by username
   *
   * @param username username of the user
   * @returns particular user
   */
  async findOne(username: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ username });
  }
}
