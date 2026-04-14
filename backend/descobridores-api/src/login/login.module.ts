import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { Login } from './login';

@Module({
  controllers: [LoginController],
  providers: [LoginService, Login]
})
export class LoginModule {}
