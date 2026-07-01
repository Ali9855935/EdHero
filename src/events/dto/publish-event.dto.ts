import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class PublishEventDto {
    @ApiProperty({
        example: true,
        description: 'Publish or unpublish the event',
    })
    @IsBoolean()
    isPublished: boolean;
}