import { Prop, Schema, SchemaFactory, } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";

@Schema({ timestamps: true })
export class Enrollmentquery {

    @Prop({ type: String, required: true, trim: true })
    name: string

    @Prop({ type: String, required: true, trim: true })
    email: string

    @Prop({ type: String, required: true, trim: true })
    phone: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true, })
    course: Types.ObjectId;

    @Prop({ type: String, required: true, trim: true })
    message: string

}
export const EnrollmentquerySchema = SchemaFactory.createForClass(Enrollmentquery)