import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackController } from './feedback.controller';
import { FeedbackEntity } from './feedback.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FeedbackEntity])],
  providers: [FeedbackService],
  controllers: [FeedbackController],
})
export class FeedbackModule {}
