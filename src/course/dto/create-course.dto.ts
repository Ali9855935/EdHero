import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ example: 'CEH V12 Lite' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'CyberSecurity Program' })
  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsString()
  @ApiProperty({
    example:
      'Entry-level ethical hacking program covering CEH V12 fundamentals.',
  })
  @IsNotEmpty()
  description!: string;

  @ApiProperty({
    example: 4.85,
  })
  @IsNumber()
  rating!: number;

  @ApiProperty({
    example: ['EC-Council CEH', 'Placement Support'],
  })
  @IsArray()
  @IsString({ each: true })
  tags!: string[];

  // @IsMongoId()
  // trainer!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '3 Months',
  })
  duration!: string;

  @IsArray()
  @ApiProperty({
    example: [
      '3 lectures / week live',
      '36 step-by-step production codes',
      'Dedicated AWS sandbox console keys included',
      'Placement assurance with 250+ partners',
    ],
  })
  @IsString({ each: true })
  highlights!: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
}
