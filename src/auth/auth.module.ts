import { FacebookOAuthStragegy } from './services/facebook.strategy';
import { UserModule } from './../user/user.module';
import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { GoogleOauthStrategy } from './services/google.strategy';

@Module({
  imports: [UserModule],
  providers: [AuthService, GoogleOauthStrategy, FacebookOAuthStragegy],
  controllers: [AuthController],
})
export class AuthModule {}
