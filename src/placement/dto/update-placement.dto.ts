import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdatePlacementDto {
    @IsOptional()
    @IsString()
    image?: string;

    @IsOptional()
    @IsString()
    companyName?: string;

    @IsOptional()
    @IsString()
    studentName?: string;

    @IsOptional()
    @IsString()
    package?: string;

    @IsOptional()
    @IsString()
    designation?: string;

    @IsOptional()
    @IsNumber()
    year?: number;
}