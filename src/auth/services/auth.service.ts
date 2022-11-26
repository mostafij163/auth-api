import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

import { UserService } from './../../user/services/user.service';
import { JwtPayload } from './../dto/auth.dto';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private userService: UserService,
  ) {}

  signToken(data: JwtPayload): string {
    const token = jwt.sign(data, this.config.get('JWT_SECRET'), {
      expiresIn: this.config.get('JWT_EXP_IN'),
    });

    return token;
  }

  verifyToken(token: string): Object {
    const decodedToken = jwt.verify(token, this.config.get('JWT_SECRET'));
    return decodedToken;
  }

  async verifyUser(email: string, password: string): Promise<string> {
    try {
      const user = await this.userService.getAUser(email);
      if (user) {
        if (bcrypt.compare(password, user?.password)) {
          const jwtToken = this.signToken({
            email: user.email,
            role: user.role,
          });

          return jwtToken;
        } else {
          throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
      } else {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}
