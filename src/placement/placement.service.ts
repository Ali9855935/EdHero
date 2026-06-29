import { Injectable } from '@nestjs/common';
import { CreatePlacementDto } from './dto/create-placement.dto';
import { UpdatePlacementDto } from './dto/update-placement.dto';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Placement, PlacementDocument } from './entities/placement.entity';

import { unlinkSync, existsSync } from 'fs';
import { resolve } from 'path';
import { NotFoundException } from '@nestjs/common';


@Injectable()
export class PlacementService {
  constructor(
    @InjectModel(Placement.name)
    private readonly placementModel: Model<PlacementDocument>,
  ) { }

  async create(createPlacementDto: CreatePlacementDto) {
    return await this.placementModel.create(createPlacementDto);
  }

  async findAll() {
    return await this.placementModel
      .find()
      .populate('enrollment', 'name')
      .exec();
  }

  async findOne(id: string) {
    return await this.placementModel.findById(id)
      .populate('enrollment', 'name')
      .exec();
  }

  async update(id: string, updatePlacementDto: UpdatePlacementDto) {
    const placement = await this.placementModel.findById(id);

    if (!placement) {
      throw new NotFoundException('Placement not found');
    }

    if (
      updatePlacementDto.image &&
      placement.image &&
      updatePlacementDto.image !== placement.image
    ) {
      const oldImagePath = resolve(
        process.cwd(),
        'uploads/placements',
        placement.image,
      );

      if (existsSync(oldImagePath)) {
        unlinkSync(oldImagePath);
      }
    }

    return this.placementModel.findByIdAndUpdate(
      id,
      updatePlacementDto,
      { new: true },
    );
  }

  async remove(id: string) {
    const placement = await this.placementModel.findById(id);

    if (!placement) {
      throw new NotFoundException('Placement not found');
    }

    if (placement.image) {
      const imagePath = resolve(
        process.cwd(),
        'uploads/placements',
        placement.image,
      );

      if (existsSync(imagePath)) {
        unlinkSync(imagePath);
      }
    }

    await this.placementModel.findByIdAndDelete(id);

    return {
      message: 'Placement deleted successfully',
    };
  }
}
