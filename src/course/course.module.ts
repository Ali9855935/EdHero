import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './entities/course.entity';
import { Admin, AdminSchema } from 'src/admins/schemas/admin.schema';
import { Enrollment, EnrollmentSchema } from 'src/enrollment/entities/enrollment.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Course.name,
        schema: CourseSchema,
      },
      {
        name: Admin.name,
        schema: AdminSchema,
      },
      {
        name: Enrollment.name,
        schema: EnrollmentSchema,
      },
    ]),
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule { }
