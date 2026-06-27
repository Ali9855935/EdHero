import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentqueryController } from './enrollmentquery.controller';
import { EnrollmentqueryService } from './enrollmentquery.service';

describe('EnrollmentqueryController', () => {
  let controller: EnrollmentqueryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnrollmentqueryController],
      providers: [EnrollmentqueryService],
    }).compile();

    controller = module.get<EnrollmentqueryController>(EnrollmentqueryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
