import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Coupon, CouponSchema } from './entities/coupon.entity';
import { Course, CourseSchema } from 'src/course/entities/course.entity';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Coupon.name, schema: CouponSchema },
    { name: Course.name, schema: CourseSchema }
  ])],
  controllers: [CouponController],
  providers: [CouponService],
})
export class CouponModule { }
