import { PartialType } from '@nestjs/swagger';
import { CreateEnrollmentqueryDto } from './create-enrollmentquery.dto';

export class UpdateEnrollmentqueryDto extends PartialType(CreateEnrollmentqueryDto) {}
