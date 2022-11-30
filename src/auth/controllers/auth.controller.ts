import {
  Controller,
  Post,
  BadRequestException,
  Body,
  Get,
  UseGuards,
  Req,
  UseFilters,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

import { AuthService } from './../services/auth.service';
import { UserService } from './../../user/services/user.service';
import { UserDTO } from './../../user/dto/user.dto';
import { signInDTO } from './../dto/auth.dto';
import { GoogleOauthGuard } from '../guards/auth.guard';
import { HttpExceptionHandler } from './../../utils/HttpException';
import { RequestUser } from './../interfaces/reqestUser';

@Controller('auth')
@UseFilters(HttpExceptionHandler)
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @ApiCreatedResponse({
    description: 'if user successfully created user will get a jwt token',
  })
  @ApiBadRequestResponse({
    description:
      'if user already exist user will get a User already exist. message',
  })
  @Post('/sign-up')
  async signup(@Body() userDto: UserDTO): Promise<string> {
    let newUser = await this.userService.getAUser({ email: userDto.email });
    if (newUser) {
      throw new BadRequestException({ message: 'User already exist.' });
    } else {
      newUser = await this.userService.createUser(userDto);

      const jwtToken = this.authService.signToken({
        email: newUser.email,
        role: newUser.role,
      });
      return jwtToken;
    }
  }

  @ApiCreatedResponse({
    description: 'if user successfully signin user will get a jwt token',
  })
  @ApiBadRequestResponse({
    description:
      'if user input invalid email or password user will get a Invalid email address or password! message',
  })
  @Post('/sign-in')
  async singin(@Body() body: signInDTO): Promise<string> {
    return await this.authService.verifyUser(body.email, body.password);
  }

  @ApiOkResponse({
    description: 'on successfull authorization user will get a jwt token',
  })
  @Get('/google')
  @UseGuards(GoogleOauthGuard)
  async googleAuth() {}

  @Get('/google/redirect')
  @UseGuards(GoogleOauthGuard)
  async googleRedirect(@Req() req: RequestUser) {
    const { user } = req;
    return this.authService.signToken({ email: user.email, role: user.role });
  }

  @ApiOkResponse({
    description: 'on successfull authorization user will get a jwt token',
  })
  @Get('/facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth() {}

  @Get('/facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookRedirect(@Req() req: RequestUser) {
    const { user } = req;
    return this.authService.signToken({ email: user.email, role: user.role });
  }
}
