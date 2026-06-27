import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class AssignTrainerDto {
    @ApiProperty({
        example: '685d1234567890abcdef1234',
        description: 'Trainer ID',
    })
    @IsMongoId({
        message: 'Please provide a valid Trainer ID',
    })
    trainer!: string;
}