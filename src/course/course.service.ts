import 'multer';
import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Course } from './entities/course.entity';
import * as fs from 'fs/promises';
import { join, extname } from 'path';
import { Admin, Role } from 'src/admins/schemas/admin.schema';

@Injectable()
export class CourseService {

  constructor(@InjectModel(Course.name)
  private readonly courseModel: Model<Course>
    , @InjectModel(Admin.name)
    private readonly adminModel: Model<Admin>) { }

  async create(dto: CreateCourseDto, file: Express.Multer.File, admin: any) {
    try {
      if (!file) {
        throw new BadRequestException('Thumbnail file is required');
      }

      // let finalFeatures: string[] = [];

      // if (dto.thumbnail) {
      //   if (typeof dto.thumbnail === 'string') {
      //     finalFeatures = (dto.thumbnail as string).split(',').map(f => f.trim());
      //   } else if (Array.isArray(dto.thumbnail)) {
      //     finalFeatures = dto.thumbnail;
      //   }
      // }

      const newCourse = new this.courseModel({
        ...dto,
        thumbnail: file.filename,
        createdBy: admin.userId,
      });
      const saved = await newCourse.save();
      return saved;
    } catch (error) {
      throw new BadRequestException(`Failed to upload thumbnail: ${(error as Error).message}`);
    }
  }

  async findAll() {
    try {
      const course = await this.courseModel.find().populate('trainer', 'name role').exec();
      return {
        message: `Courses Found Successfully`,
        data: course
      };
    } catch (error) {
      return {
        message: `Courses Not Found`,
        error: error.message
      }
    }
  }

  async findCourseByTrainer(trainerId: Types.ObjectId) {
    try {
      const course = await this.courseModel.find({ trainer: trainerId }).populate('trainer', 'name role').exec();
      return {
        message: `Courses Found By Trainer Successfully`,
        data: course
      };
    } catch (error) {
      return {
        message: `Courses Not Found`,
        error: error.message
      }
    }
  }

  async findCourseByAdmin(adminId: string) {
    try {
      // console.log(adminId);

      const course = await this.courseModel.find({ createdBy: new Types.ObjectId(adminId) }).populate('createdBy', 'name role').exec();
      return {
        message: `Courses Found By Admin Successfully`,
        data: course
      };
    } catch (error) {
      return {
        message: `Courses Not Found`,
        error: error.message
      }
    }
  }

  async findOne(id: string) {
    try {
      const course = await this.courseModel.findById(id).populate('trainer', 'name role').exec();
      return {
        message: `Course Found Successfully`,
        data: course
      };
    } catch (error) {
      return {
        message: `Course Not Found`,
        error: error.message
      }
    }
  }

  async updateCourse(id: string, updateCourseDto: UpdateCourseDto, file: Express.Multer.File) {
    try {
      const course = await this.courseModel.findById(id)
      if (!course) {
        throw new BadRequestException('Course not found');
      }

      if (file) {
        // ✅ Delete old file
        if (course.thumbnail) {
          const oldPath = join(process.cwd(), 'uploads', course.thumbnail);
          try {
            await fs.unlink(oldPath);
          } catch (error) {
            // Don't throw error if old file can't be deleted
            console.warn('Failed to delete old thumbnail:', error);
          }
        }
        // ✅ Set new file
        course.thumbnail = file.filename;
      }

      // ✅ Update all other fields
      const updateFields = Object.keys(updateCourseDto);

      for (const field of updateFields) {
        // Only update if field is present in DTO
        if (updateCourseDto[field] !== undefined) {
          course[field] = updateCourseDto[field];
        }
      }

      const updated = await course.save();
      return {
        message: 'update successfull',
        updated
      };
    } catch (error) {
      return {
        message: 'update failed',
        error: error.message
      }
    }
  }

  async deleteTrainer(id: string) {
    try {
      const trainer = await this.adminModel.findById(id)
      if (!trainer) {
        throw new BadRequestException('Trainer not found');
      }
      if (trainer.role !== Role.TRAINER) {
        throw new BadRequestException('Trainer not found');
      }

      const course = await this.courseModel.updateMany({ trainer: id }, { $set: { trainer: null } })
      await this.adminModel.findByIdAndDelete({ id })

      return {
        message: 'Trainer deleted successfully',
        course,
      };

    }

    catch (error) {
      throw new BadRequestException(error.message);
    }

  }


  async assignTrainer(courseId: string, trainerId: string) {
    try {
      const course = await this.courseModel.findById(courseId)
      if (!course) {
        throw new BadRequestException('Course not found');
      }
      const trainer = await this.adminModel.findById(trainerId)
      if (!trainer) {
        throw new BadRequestException('Trainer not found');
      }
      if (trainer.role !== Role.TRAINER) {
        throw new BadRequestException('Trainer not found');
      }
      course.trainer = trainer._id
      await course.save();
      return {
        message: 'Trainer assigned successfully',
        course,
        trainer
      };

    }
    catch (error) {
      throw new BadRequestException(error.message);
    }
  }


}
