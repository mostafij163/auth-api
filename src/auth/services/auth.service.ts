import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

import { UserService } from './../../user/services/user.service';
import { JwtPayload } from './../dto/auth.dto';

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
      const user = await this.userService.getAUser({email: email});
      if (user && bcrypt.compare(password, user?.password)) {
        const jwtToken = this.signToken({
          email: user.email,
          role: user.role,
        });

        return jwtToken;
      } else {
        throw new UnauthorizedException({
          message: 'Invalid email address or password!',
        });
      }
    } catch (error) {
      throw error;
    }
  }
}
