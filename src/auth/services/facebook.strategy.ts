import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';

import { UserService } from './../../user/services/user.service';

@Injectable()
export class FacebookOAuthStragegy extends PassportStrategy(
  Strategy,
  'facebook',
) {
  constructor(config: ConfigService, private userService: UserService) {
    super({
      clientID: config.get<string>('FACEBOOK_AUTH_CLIENT_ID'),
      clientSecret: config.get<string>('FACEBOOK_AUTH_CLIENT_SECRET'),
      callbackURL: config.get<string>('FACEBOOK_AUTH_REDIRECT_URI'),
      scope: 'email',
      profileFields: ['email', 'name'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ) {
    const { id, name, emails } = profile;

    let user = await this.userService.getAUser({ clientId: id });
    if (user) {
      return await this.userService.getAUser({ clientId: id });
    } else {
      return (user = await this.userService.createUser({
        email: emails[0].value,
        name: name.givenName,
        clientId: id,
      }));
    }
  }
}
