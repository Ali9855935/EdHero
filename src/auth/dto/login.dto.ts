import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEmail,
  MinLength,
  Matches,
  IsString,
} from 'class-validator';

export class loginDto {
  @IsNotEmpty()
  @IsEmail(
    {},
    {
      message:
        'Invalid email format. Please enter a valid email (e.g., user@example.com)',
    },
  )
  @ApiProperty({ example: 'enter your email' })
  email!: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'enter your password' })
  @IsString()
  password!: string;
}
