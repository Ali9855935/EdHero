import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type PlacementDocument = HydratedDocument<Placement>;

@Schema({
    timestamps: true,
})
export class Placement {

    @Prop({ required: true })
    image: string;

    @Prop({ required: true })
    companyName: string;

    @Prop({ required: true })
    package: string;

    @Prop({ required: true })
    designation: string;

    @Prop({ required: true })
    year: number;

    // @Prop({ required: true })
    // studentName: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Enrollment',
        required: true,
    })
    enrollment: Types.ObjectId;
}

export const PlacementSchema = SchemaFactory.createForClass(Placement);