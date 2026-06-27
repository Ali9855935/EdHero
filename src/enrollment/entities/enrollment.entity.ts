import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";

@Schema({ timestamps: true })
export class Enrollment {
    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ required: true, trim: true })
    email: string;

    @Prop({ required: true, trim: true })
    phone: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true, })
    course: Types.ObjectId;



}

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);