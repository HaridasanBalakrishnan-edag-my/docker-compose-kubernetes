import { AbstractDto } from 'common/dto/abstract.dto';
import { PaginatedDto } from 'common/dto/paginated.dto';
import { FeedbackEntity } from '../feedback.entity';

export class FeedbackDto extends AbstractDto {
  name: string;

  description?: string;

  constructor(feedbackEntity: FeedbackEntity) {
    super(feedbackEntity);

    this.name = feedbackEntity.name;
    this.description = feedbackEntity.description;
  }
}

export class FeedbacksDto extends PaginatedDto(() => [FeedbackDto]) {}

export class FeedbacksListDto extends FeedbackDto {}
