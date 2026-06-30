import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export enum discountType {
    PERCENTAGE = "PERCENTAGE",
    FLAT = "FLAT"
}

@Schema({ timestamps: true })
export class Coupon {

    @Prop({ required: true, type: String, trim: true })
    title: string

    @Prop({ required: true, trim: true, type: String })
    description: string

    @Prop({ required: true })
    startDate: Date

    @Prop({ required: true })
    endDate: Date

    @Prop({ required: true, enum: discountType })
    discountType: discountType

    @Prop({ required: true })
    discountValue: number

    @Prop({ trim: true, unique: true })
    couponCode: string

    @Prop({ required: true, ref: 'Course', type: Types.ObjectId, default: [] })
    courses: Types.ObjectId[]

    @Prop({ required: true, ref: 'Admin', type: Types.ObjectId })
    createdBy: Types.ObjectId

    @Prop({ default: true })
    isActive: boolean
}
export const CouponSchema = SchemaFactory.createForClass(Coupon);
