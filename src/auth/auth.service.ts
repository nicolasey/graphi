import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { LoginInput } from './interfaces/login.input';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/users/user.schema';
import { ConfigService } from '@nestjs/config';
import { AuthSuccess } from './interfaces/auth-success.output';

@Injectable()
export class AuthService {
  constructor(
    private readonly userS: UsersService,
    private readonly config: ConfigService,
  ) {}

  async login(input: LoginInput) {
    try {
      const user = await this.userS.findByEmail(input.email);
      await bcrypt.compare(input.password, user.password);
      const token = await this.issueToken(user);

      return new AuthSuccess(token, user);
    } catch (err) {
      Logger.error(err, 'Login try as ' + input.email);
    }
  }

  private async issueToken(user: User): Promise<string> {
    const { id, email } = user;
    return await jwt.sign({ id, email }, this.config.get('JWT_SECRET'), {
      expiresIn: this.config.get('JWT_EXPIRATION'),
    });
  }
}
