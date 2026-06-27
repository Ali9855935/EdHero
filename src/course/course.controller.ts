import 'multer';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth-guard';
import { Role } from 'src/admins/schemas/admin.schema';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorators';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { extname, resolve } from 'path';
import { AssignTrainerDto } from './dto/assigntrainerdto';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) { }

  @Post('create-course')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const targetPath = resolve(process.cwd(), 'uploads');
          if (!existsSync(targetPath)) {
            mkdirSync(targetPath, { recursive: true });
          }
          cb(null, targetPath);
        },
        filename: (_req, file, cb) => {
          const uniqueName = Date.now() + extname(file.originalname);
          cb(null, uniqueName);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateCourseDto,
    description: 'Course details',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        category: { type: 'string' },
        thumbnail: { type: 'string', format: 'binary' }, // Swagger file upload option
        description: { type: 'string' },
        rating: { type: 'number' },
        tags: { type: 'array', items: { type: 'string' } },
        duration: { type: 'string' },
        highlights: { type: 'array', items: { type: 'string' } },
      },
      required: ['title', 'description', 'thumbnail', 'category', 'duration', 'highlights', 'tags', 'rating'],
    },
  })
  create(
    @Body() dto: CreateCourseDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    return this.courseService.create(dto, file, req.user);
  }

  @Get('find-course')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiBearerAuth()
  findAll() {
    return this.courseService.findAll();
  }

  @Get('find-course-by-trainer')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.TRAINER)
  @ApiBearerAuth()
  findCourseByTrainer(@Req() req) {
    return this.courseService.findCourseByTrainer(req.user.userId);
  }


  @Get('find-course-by-admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  findCourseByAdmin(@Req() req) {
    // console.log(req.user);
    return this.courseService.findCourseByAdmin(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }

  @Patch('/update-course/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const targetPath = resolve(process.cwd(), 'uploads');
          if (!existsSync(targetPath)) {
            mkdirSync(targetPath, { recursive: true });
          }
          cb(null, targetPath);
        },
        filename: (_req, file, cb) => {
          const uniqueName = Date.now() + extname(file.originalname);
          cb(null, uniqueName);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UpdateCourseDto,
  })
  updateCourse(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.courseService.updateCourse(id, updateCourseDto, file);
  }

  @Patch('/assign-trainer/:courseId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiBearerAuth()
  assignTrainer(
    @Param('courseId') courseId: string,
    @Body() dto: AssignTrainerDto,
  ) {
    return this.courseService.assignTrainer(courseId, dto.trainer);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseService.deleteTrainer(id);
  }
}
