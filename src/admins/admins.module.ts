import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './schemas/admin.schema';
import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';
import { Course, CourseSchema } from 'src/course/entities/course.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: Course.name, schema: CourseSchema },
    ]),
  ],
  controllers: [AdminsController],
  providers: [AdminsService],
  exports: [MongooseModule, AdminsService],
})
export class AdminsModule {}
