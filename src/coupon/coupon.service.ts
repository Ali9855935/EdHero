import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Coupon } from './entities/coupon.entity';
import { Model } from 'mongoose';
import { Course } from 'src/course/entities/course.entity';
import { throws } from 'assert';

@Injectable()
export class CouponService {
  constructor(@InjectModel(Coupon.name)
  private readonly couponModel: Model<Coupon>,
    @InjectModel(Course.name)
    private readonly courseModel: Model<Course>
  ) { }


  async create(dto: CreateCouponDto, Admin) {
    // console.log(Admin.userId);

    const course = await this.courseModel.find({ _id: { $in: dto.courses } })
    if (course.length !== dto.courses.length) {
      throw new BadRequestException('Invalid Course Seleted')
    }


    const coupon = await this.couponModel.create({
      ...dto,
      createdBy: Admin.userId,

    })
    await coupon.save();
    return {
      message: 'success',
      coupon
    }
  }

  async findAll() {
    const coupon = await this.couponModel.find({
      isActive: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() }
    }).populate({
      path: 'courses', select: 'title', match: {
        isDeleted: false
      }
    }).exec()
    return coupon

  }


  async forpublicUse() {
    const coupon = await this.couponModel.find({
      isActive: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() }
    }).populate({
      path: 'courses', select: 'title', match: {
        isDeleted: false
      }
    }).exec()
    return coupon

  }

  async findOne(id: string) {
    const coupon = await this.couponModel.findById({ _id: id, isActive: true }).populate({
      path: 'courses', select: 'title', match: {
        isDeleted: false
      }
    }).exec()

    if (!coupon) {
      throw new BadRequestException('Coupon not found')
    }
    return coupon
  }

  async update(id: string, dto: UpdateCouponDto) {
    const coupon = await this.couponModel.findById(id)
    if (!coupon) {
      throw new BadRequestException('Coupon not found')
    }
    await coupon.updateOne(dto)
    return {
      message: 'coupon updated successfully',
      coupon
    }

  }

  async remove(id: string) {
    const coupon = await this.couponModel.findByIdAndDelete(id, { new: true })
    if (!coupon) {
      throw new BadRequestException('Coupon not found')
    }
    return {
      message: 'coupon deleted successfully',
      coupon
    }

  }
}
