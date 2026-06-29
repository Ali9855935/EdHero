import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentqueryService } from './enrollmentquery.service';

describe('EnrollmentqueryService', () => {
  let service: EnrollmentqueryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnrollmentqueryService],
    }).compile();

    service = module.get<EnrollmentqueryService>(EnrollmentqueryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
