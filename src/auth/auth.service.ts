import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/user/entities/user.entity';
import { comparePassword } from 'src/utils/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtTokenService: JwtService,
  ) {}

  /**
   * Validate user credentials
   *
   * @param username username of the user
   * @param password password of the user
   * @returns user if found, throw UnauthorizedException otherwise
   */
  async validateUserCredentials(
    username: string,
    password: string,
  ): Promise<User> {
    const user = await this.userService.findOne(username);

    if (user) {
      const matched = comparePassword(password, user.password);
      if (matched) {
        return user;
      } else {
        throw new UnauthorizedException('Password is incorrect');
      }
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  /**
   * Login by user credentials and return JWT Token
   *
   * @param loginDto login data, including username and password
   * @returns access_token
   */
  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const user = await this.validateUserCredentials(username, password);

    const payload = { sub: user.id };

    return {
      access_token: this.jwtTokenService.sign(payload),
    };
  }
}
