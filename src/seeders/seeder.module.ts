import { FeedbackSeederModule } from './feedback/feedback.module';
import { Module, Logger, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from 'shared/services/config.service';
import { SharedModule } from 'shared/shared.module';
import { Seeder } from './seeder';

@Module({
  imports: [
    forwardRef(() =>
      TypeOrmModule.forRootAsync({
        imports: [SharedModule],
        useFactory: (configService: ConfigService) =>
          configService.typeOrmConfig,
        inject: [ConfigService],
      }),
    ),
    FeedbackSeederModule,
  ],
  providers: [Logger, Seeder],
})
export class SeederModule {}
