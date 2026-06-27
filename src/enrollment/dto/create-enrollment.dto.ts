import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, MinLength, IsNumber, IsMongoId } from 'class-validator';

export class CreateEnrollmentDto {

    @ApiProperty({ example: 'Enter the Name' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'Enter the Eamil' })
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email: string;

    @ApiProperty({ example: 'Enter the Phone Number' })
    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    phone: string;

    @ApiProperty({ example: 'Enter the course' })
    @IsMongoId()
    @IsString()
    course: string;

}
