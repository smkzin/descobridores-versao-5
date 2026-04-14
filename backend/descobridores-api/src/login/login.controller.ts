import { Body, Controller, Post } from '@nestjs/common';
import RegisterDTO from './DTO/register.dto';
import { LoginService } from './login.service';
import LoginDTO from './DTO/login.dto';

@Controller('login')
export class LoginController {
    constructor(private readonly loginService: LoginService){}

    @Post("register")
    async register(@Body() user: RegisterDTO){
        return this.loginService.register(user);
    }

    @Post("login")
    async login(@Body() user: LoginDTO){
        return this.loginService.login(user)
    } 
}
