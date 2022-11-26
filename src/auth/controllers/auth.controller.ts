import {
  Controller,
  Post,
  HttpException,
  HttpStatus,
  Body,
} from '@nestjs/common';

import { AuthService } from './../services/auth.service';
import { UserService } from './../../user/services/user.service';
import { UserDTO } from './../../user/dto/user.dto';
import { signInDTO } from './../dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('/sign-up')
  async signup(@Body() userDto: UserDTO): Promise<string> {
    try {
      const newUser = await this.userService.createUser(userDto);
      const jwtToken = this.authService.signToken({
        email: newUser.email,
        role: newUser.role,
      });
      return jwtToken;
    } catch (error) {
      throw new HttpException(
        {
          status: 'fail',
          message: 'Something went wrong. Please try again later!',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/sign-in')
  async singin(@Body() body: signInDTO): Promise<string> {
    try {
      return await this.authService.verifyUser(body.email, body.password);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: 'fail',
          message: 'Something went wrong. Please try again later!',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
