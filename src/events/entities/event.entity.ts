import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventDocument = Event & Document;

@Schema({
    timestamps: true,
})
export class Event {
    @Prop({
        required: true,
    })
    title: string;

    @Prop({
        required: true,
    })
    description: string;

    @Prop({
        required: true,
    })
    banner: string;

    @Prop({
        required: true,
    })
    startDate: Date;

    @Prop({
        required: true,
    })
    endDate: Date;

    @Prop({
        default: true,
    })
    isPublished: boolean;

    @Prop({
        default: false,
    })
    isDeleted: boolean;
}

export const EventSchema = SchemaFactory.createForClass(Event);