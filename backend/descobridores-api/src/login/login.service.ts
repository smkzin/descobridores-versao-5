import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import RegisterDTO from './DTO/register.dto';
import * as bcrypt from 'bcrypt';
import LoginDTO from './DTO/login.dto';

@Injectable()
export class LoginService {
    constructor(private readonly prisma: PrismaService) { }

    async register(data: RegisterDTO) {
        const hashedPassword = await bcrypt.hash(data.password, 10)
        const user = await this.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword
            }
        })

        return user
    }

    async login(data: LoginDTO){
        const user = await this.prisma.user.findUnique({
            where: {email: data.email}
        })

        if(!user){throw new UnauthorizedException("Email ou senha Invalidos")}

        const comparePassword = await bcrypt.compare(
            data.password,
            user.password
        )

        if(!comparePassword){throw new UnauthorizedException("Email ou senha invalidos")}

        return "User logged!"
    }
}
