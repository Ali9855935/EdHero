import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCouponDto } from './create-coupon.dto';
import { IsArray, IsDateString, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { discountType } from '../entities/coupon.entity';
import { Type } from 'class-transformer';

export class UpdateCouponDto extends PartialType(CreateCouponDto) {

    @ApiProperty({
        example: 'Summer Offer',
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        example: 'Get discount on selected courses',
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        example: '2026-07-01T00:00:00.000Z',
    })
    @IsDateString()
    @IsString()
    startDate: string;

    @ApiProperty({
        example: '2026-07-31T23:59:59.000Z',
    })
    @IsString()
    // @IsDateString()
    endDate: string;

    @ApiProperty({
        enum: discountType,
        example: discountType.PERCENTAGE,
    })
    @IsEnum(discountType)
    discountType: discountType;

    @ApiProperty({
        example: 20,
    })
    @Type(() => Number)
    @IsNumber()
    discountValue: number;

    @ApiProperty({
        example: 'SUMMER20',
    })
    @IsString()
    @IsOptional()
    couponCode?: string;

    @ApiProperty({
        type: [String],
        example: [
            '6860d0d44fd5c5c4b4d1b123',
            '6860d0d44fd5c5c4b4d1b456',
        ],
    })
    @IsArray()
    @IsMongoId({ each: true })
    courses: string[];


}
