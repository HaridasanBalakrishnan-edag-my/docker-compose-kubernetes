import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackEntity } from 'modules/feedback/feedback.entity';
import { FeedbackSeederService } from './feedback.service';

@Module({
  imports: [TypeOrmModule.forFeature([FeedbackEntity])],
  providers: [FeedbackSeederService],
  exports: [FeedbackSeederService],
})
export class FeedbackSeederModule {}
