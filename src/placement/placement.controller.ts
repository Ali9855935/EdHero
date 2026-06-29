import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { resolve, extname } from 'path';
import {
  ApiBody,
  ApiConsumes,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { existsSync, mkdirSync } from 'fs';

import { PlacementService } from './placement.service';
import { CreatePlacementDto } from './dto/create-placement.dto';
import { UpdatePlacementDto } from './dto/update-placement.dto';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth-guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from 'src/admins/schemas/admin.schema';

@ApiTags('Placement')
@Controller('placement')
export class PlacementController {
  constructor(private readonly placementService: PlacementService) { }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
        companyName: {
          type: 'string',
        },
        package: {
          type: 'string',
        },
        designation: {
          type: 'string',
        },
        year: {
          type: 'number',
        },
        enrollment: {
          type: 'string',
        },
      },
    },
  })

  @Post('create-placement')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const targetPath = resolve(process.cwd(), 'uploads/placements');

          if (!existsSync(targetPath)) {
            mkdirSync(targetPath, { recursive: true });
          }

          cb(null, targetPath);
        },
        filename: (req, file, callback) => {
          const uniqueName =
            Date.now() + '-' + Math.round(Math.random() * 1e9);

          callback(null, uniqueName + extname(file.originalname));
        },
      }),
    }),
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createPlacementDto: CreatePlacementDto,
  ) {

    createPlacementDto.image = file.filename;

    return this.placementService.create(createPlacementDto);
  }

  @Get(`get-all-enrollment`)
  findAll() {
    return this.placementService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.placementService.findOne(id);
  }


  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
        companyName: {
          type: 'string',
        },
        package: {
          type: 'string',
        },
        designation: {
          type: 'string',
        },
        year: {
          type: 'number',
        },
      },
    },
  })
  @Patch('update-placement/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const targetPath = resolve(process.cwd(), 'uploads/placements');

          if (!existsSync(targetPath)) {
            mkdirSync(targetPath, { recursive: true });
          }

          cb(null, targetPath);
        },
        filename: (_req, file, cb) => {
          const uniqueName =
            Date.now() + '-' + Math.round(Math.random() * 1e9);

          cb(null, uniqueName + extname(file.originalname));
        },
      }),
    }),
  )
  update(
    @Param('id') id: string,
    @Body() updatePlacementDto: UpdatePlacementDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      updatePlacementDto.image = file.filename;
    }

    return this.placementService.update(id, updatePlacementDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.placementService.remove(id);
  }
}
