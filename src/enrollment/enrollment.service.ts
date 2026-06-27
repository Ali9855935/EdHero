import { Injectable } from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Enrollment } from './entities/enrollment.entity';
import { Model } from 'mongoose';
import { Course } from 'src/course/entities/course.entity';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectModel(Enrollment.name) private readonly enrollmentModel: Model<Enrollment>,
    @InjectModel(Course.name) private readonly courseModel: Model<Course>,
  ) { }
  async create(dto: CreateEnrollmentDto) {
    const enrollment = new this.enrollmentModel(dto);
    const saveEnrollment = await enrollment.save();
    await this.courseModel.findByIdAndUpdate({ _id: dto.course }, { $inc: { enrolledCount: 1 } });

    return {
      message: 'Enrollment created successfully',
      data: saveEnrollment
    };
  }

  async findAll() {
    return this.enrollmentModel.find().populate('course', 'title');
  }

  findOne(id: number) {
    return `This action returns a #${id} enrollment`;
  }

  update(id: number, updateEnrollmentDto: UpdateEnrollmentDto) {
    return `This action updates a #${id} enrollment`;
  }

  remove(id: number) {
    return `This action removes a #${id} enrollment`;
  }
}
