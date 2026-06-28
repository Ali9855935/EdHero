import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Enrollment } from './entities/enrollment.entity';
import { Model } from 'mongoose';
import { Course } from 'src/course/entities/course.entity';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectModel(Enrollment.name) private readonly enrollmentModel: Model<Enrollment>,
    @InjectModel(Course.name) private readonly courseModel: Model<Course>,
    private readonly mailService: MailService,
  ) { }
  async create(dto: CreateEnrollmentDto) {
    try {
      const course = await this.courseModel.findById(dto.course);
      if (!course) {
        throw new BadRequestException('Course not found');
      }
      const enrollment = new this.enrollmentModel(dto);
      const saveEnrollment = await enrollment.save();
      await this.courseModel.findByIdAndUpdate(dto.course, { $inc: { enrolledCount: 1 } });
      await this.mailService.sendEnrollmentMail(saveEnrollment.email, saveEnrollment.name, course.title)
      return {
        message: 'Enrollment created successfully',
        data: saveEnrollment
      };

    } catch (error) {
      return {
        message: 'Enrollment creation failed',
        error: error.message
      }
    }
  }

  async findAll() {
    try {
      const enrollments = await this.enrollmentModel.find().populate('course', 'title');
      return {
        message: `Enrollments Found Successfully`,
        data: enrollments
      }
    } catch (error) {
      return {
        message: `Enrollments Not Found`,
        error: error.message
      }
    }
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
