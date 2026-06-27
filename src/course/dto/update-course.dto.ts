import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';
export class UpdateCourseDto {
    @ApiPropertyOptional({ example: 'CEH V12 Lite' })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({ example: 'CyberSecurity Program' })
    @IsOptional()
    @IsString()
    category?: string;

    @ApiPropertyOptional({
        example:
            'Entry-level ethical hacking program covering CEH V12 fundamentals.',
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ example: 4.85 })
    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsNumber()
    rating?: number;

    @ApiPropertyOptional({
        example: ['EC-Council CEH', 'Placement Support'],
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @Transform(({ value }) =>
        typeof value === 'string' ? value.split(',') : value,
    )
    tags?: string[];

    @ApiPropertyOptional({ example: '3 Months' })
    @IsOptional()
    @IsString()
    duration?: string;

    @ApiPropertyOptional({
        example: [
            '3 lectures / week live',
            '36 step-by-step production codes',
        ],
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @Transform(({ value }) =>
        typeof value === 'string' ? value.split(',') : value,
    )
    highlights?: string[];

    @ApiPropertyOptional({
        type: 'string',
        format: 'binary',
        description: 'Course Thumbnail File',
    })
    @IsOptional()
    thumbnail?: any;

    // @ApiPropertyOptional({ example: true })
    // @IsOptional()
    // @IsBoolean()
    // isActive?: boolean;
}



