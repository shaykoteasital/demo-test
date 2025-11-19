import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @((MinLength as any)(6))
  password: string;
}
