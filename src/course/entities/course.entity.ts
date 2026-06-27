import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Admin } from 'src/admins/schemas/admin.schema';

export type CourseDocument = HydratedDocument<Course>;

@Schema({ timestamps: true })
export class Course {
  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ required: true, trim: true })
  category!: string;

  @Prop({ required: true })
  thumbnail!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ default: 0 })
  rating!: number;

  @Prop({ type: [String], default: [] })
  tags!: string[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  })
  createdBy!: Admin | Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: false,
    default: null,
  })
  trainer!: Admin | Types.ObjectId | null;

  @Prop({ required: true })
  duration!: string;

  @Prop({ type: [String], default: [] })
  highlights!: string[];

  @Prop({ default: 0 })
  enrolledCount!: number;

  @Prop({ default: true })
  isActive!: boolean;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
