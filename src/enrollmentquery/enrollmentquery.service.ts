import { Injectable } from '@nestjs/common';
import { CreateEnrollmentqueryDto } from './dto/create-enrollmentquery.dto';
import { UpdateEnrollmentqueryDto } from './dto/update-enrollmentquery.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Enrollmentquery } from './entities/enrollmentquery.entity';
import { Model } from 'mongoose';
import { Course } from 'src/course/entities/course.entity';

@Injectable()
export class EnrollmentqueryService {
  constructor(
    @InjectModel(Enrollmentquery.name) private readonly enrollmentqueryModel: Model<Enrollmentquery>,
    @InjectModel(Course.name) private readonly courseModel: Model<Course>

  ) { }

  async create(dto: CreateEnrollmentqueryDto) {
    try {
      const query = await this.enrollmentqueryModel.create(dto);
      return {
        message: `EnrollmentQuery Created Successfully`,
        data: query
      }
    }
    catch (error) {
      return {
        message: `EnrollmentQuery Creation Failed`,
        error: error.message
      }
    }

  }

  async findAll() {
    try {
      const queries = await this.enrollmentqueryModel.find().populate('course', 'title')
      return {
        message: `EnrollmentQueries Found Successfully`,
        data: queries
      }
    }
    catch (error) {
      return {
        message: `EnrollmentQueries Not Found`,
        error: error.message
      }
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} enrollmentquery`;
  }

  update(id: number, updateEnrollmentqueryDto: UpdateEnrollmentqueryDto) {
    return `This action updates a #${id} enrollmentquery`;
  }

  remove(id: number) {
    return `This action removes a #${id} enrollmentquery`;
  }
}
