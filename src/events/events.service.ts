import 'multer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name)
    private readonly eventModel: Model<Event>,
  ) { }

  async create(dto: CreateEventDto, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Banner image is required');
    }

    const event = new this.eventModel({
      ...dto,
      banner: file.filename,
    });

    await event.save();

    return {
      message: 'Event created successfully',
      data: event,
    };
  }

  async findAll() {
    const events = await this.eventModel.find({
      isDeleted: false,
    });

    return {
      message: 'Events fetched successfully',
      data: events,
    };
  }

  async findOne(id: string) {
    const event = await this.eventModel.find({
      _id: id,
      isDeleted: false
    });

    if (!event) {
      throw new BadRequestException('Event not found');
    }

    return event;
  }

  async update(
    id: string,
    dto: UpdateEventDto,
    file: Express.Multer.File,
  ) {
    const event = await this.eventModel.findById(id);

    if (!event) {
      throw new BadRequestException('Event not found');
    }

    if (file) {
      event.banner = file.filename;
    }

    Object.assign(event, dto);

    await event.save();

    return {
      message: 'Event updated successfully',
      data: event,
    };
  }

  async remove(id: string) {
    const event = await this.eventModel.findById(id);

    if (!event) {
      throw new BadRequestException('Event not found');
    }

    event.isDeleted = true;

    await event.save();

    return {
      message: 'Event deleted successfully',
    };
  }

  async websiteEvents() {
    return this.eventModel.find({
      isDeleted: false,
      isPublished: true,
    });
  }

  async togglePublish(id: string) {
    const event = await this.eventModel.findOne({
      _id: id,
      isDeleted: false
    });

    if (!event) {
      throw new BadRequestException('Event not found');
    }

    event.isPublished = !event.isPublished;

    await event.save();

    return {
      message: `Event ${event.isPublished ? 'published' : 'unpublished'} successfully`,
      data: event,
    };
  }
}