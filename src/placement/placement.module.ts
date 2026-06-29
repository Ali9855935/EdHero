import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PlacementController } from './placement.controller';
import { PlacementService } from './placement.service';
import { Placement, PlacementSchema } from './entities/placement.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Placement.name,
        schema: PlacementSchema,
      },
    ]),
  ],
  controllers: [PlacementController],
  providers: [PlacementService],
})
export class PlacementModule { }