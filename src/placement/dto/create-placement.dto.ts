import { Type } from 'class-transformer';
import {
    IsMongoId,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreatePlacementDto {

    @IsOptional()
    image: string;

    @IsString()
    @IsNotEmpty()
    companyName: string;

    @IsString()
    @IsNotEmpty()
    package: string;

    @IsString()
    @IsNotEmpty()
    designation: string;

    @Type(() => Number)
    @IsNumber()
    year: number;

    @IsMongoId()
    @IsNotEmpty()
    enrollment: string;
}