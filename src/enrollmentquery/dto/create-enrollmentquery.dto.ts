import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsMongoId, IsEmail } from "class-validator";

export class CreateEnrollmentqueryDto {

    @ApiProperty({ example: '60d5f78f1c9d440000e1a2b3' })
    @IsNotEmpty()
    @IsString()
    @IsMongoId()
    course: string;

    @ApiProperty({ example: 'John Doe' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'john@gmail.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: '1234567890' })
    @IsNotEmpty()
    @IsString()
    phone: string;

    @ApiProperty({ example: 'message' })
    @IsString()
    @IsNotEmpty()
    message: string;
}
