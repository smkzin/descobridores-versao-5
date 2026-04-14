import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginController } from './login/login.controller';
import { Login } from './login/login';
import { LoginService } from './login/login.service';
import { LoginModule } from './login/login.module';
import { PrismaService } from './database/prisma.service';
import { PrismaModule } from './database/prisma.module';

@Module({
  imports: [LoginModule, PrismaModule],
  controllers: [AppController, LoginController],
  providers: [AppService, Login, LoginService, PrismaService],
})
export class AppModule {}
