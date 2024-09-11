import { Exclude } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class UserMinimalDTO {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsStrongPassword()
  @IsNotEmpty()
  @Exclude()
  password!: string;
}
