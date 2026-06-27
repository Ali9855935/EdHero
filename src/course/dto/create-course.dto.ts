import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
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
  @IsNotEmpty()
  @Transform(({ value }) => Number(value)) // 👈 String ko number banayega
  rating: number;

  @ApiProperty({
    example: ['EC-Council CEH', 'Placement Support'],
  })
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => (typeof value === 'string' ? value.split(',') : value))
  tags: string[];


  // @ApiPropertyOptional({ example: 'Enter the serviceId' })
  // @IsOptional()
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
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => (typeof value === 'string' ? value.split(',') : value))
  highlights: string[];

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary', description: 'Course Thumbnail File' })
  thumbnail: any; // Swagger isse file upload ka button bana dega

}
