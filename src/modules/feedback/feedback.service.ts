import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, In, Repository } from 'typeorm';
import { FeedbackEntity } from './feedback.entity';
import { FeedbackDto } from './dto/feedback.dto';
import { FeedbackCreateInput, FeedbackUpdateInput } from './dto/feedback.input';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(FeedbackEntity)
    readonly repo: Repository<FeedbackEntity>,
  ) {}

  async create(input: FeedbackCreateInput): Promise<FeedbackDto> {
    const feedback = this.repo.create(input);
    const out = await this.repo.save(feedback);
    return out.toDto();
  }

  async findOne(
    condition: FindOneOptions<FeedbackEntity>,
    nullable: boolean = true,
  ): Promise<FeedbackDto> {
    const feedback = await this.repo.findOne(condition);
    if (!feedback && !nullable) {
      throw new NotFoundException(`Failed to find feedback`);
    }
    return feedback?.toDto();
  }

  async delete(ids: string[]): Promise<FeedbackDto[]> {
    const results = await this.repo.find({ where: { id: In(ids) } });
    await this.repo.delete({ id: In(ids) });
    return results.toDtos();
  }

  async update(id: string, input: FeedbackUpdateInput): Promise<FeedbackDto> {
    await this.findOne({ where: { id } });
    const feedback = await this.repo.preload({ ...input, id });
    const result = await this.repo.save(feedback);
    return result.toDto();
  }
}
