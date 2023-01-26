import { Global, Module } from '@nestjs/common';
import { ConfigService } from './services/config.service';
import { GeneratorService } from './services/generator.service';
import { PaginationService } from './services/pagination.service';
import { ValidatorService } from './services/validator.service';

const providers = [
  ConfigService,
  GeneratorService,
  ValidatorService,
  PaginationService,
];

@Global()
@Module({
  providers: [...providers],
  imports: [],
  exports: [...providers],
})
export class SharedModule {}
