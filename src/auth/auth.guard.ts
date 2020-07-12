import {
  CanActivate,
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';

interface JwtPayload {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private config: ConfigService, private userS: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();
    const bearerToken = ctx.headers.authorization;
    const payload = await this.validateToken(bearerToken);
    const user = await this.userS.findByEmail(payload.email);
    ctx.user = user;
    Logger.log(ctx.user, 'Context User');
    return true;
  }

  async validateToken(auth: string): Promise<JwtPayload> {
    if (auth.split(' ')[0] !== 'Bearer') {
      throw new UnauthorizedException('token.noToken');
    }
    const token = auth.split(' ')[1];
    try {
      return jwt.verify(token, this.config.get('JWT_SECRET')) as JwtPayload;
    } catch (err) {
      throw new UnauthorizedException('token.invalid');
    }
  }
}
