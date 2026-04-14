import { IsEmail, IsString, MinLength } from "class-validator";

class RegisterDTO {
    @IsString()
    name:  string

    @IsEmail()
    email: string

    @IsString()
    @MinLength(6)
    password: string
}

export default RegisterDTO