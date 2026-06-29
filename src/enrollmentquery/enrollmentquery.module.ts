import { Module } from '@nestjs/common';
import { EnrollmentqueryService } from './enrollmentquery.service';
import { EnrollmentqueryController } from './enrollmentquery.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from 'src/course/entities/course.entity';
import { Enrollmentquery, EnrollmentquerySchema } from './entities/enrollmentquery.entity';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Course.name, schema: CourseSchema },
    { name: Enrollmentquery.name, schema: EnrollmentquerySchema }
  ])],
  controllers: [EnrollmentqueryController],
  providers: [EnrollmentqueryService],
})
export class EnrollmentqueryModule { }
