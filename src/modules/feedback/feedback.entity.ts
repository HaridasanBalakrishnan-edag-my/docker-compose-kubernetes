import { AbstractEntity } from 'common/abstract.entity';
import { Column, Entity } from 'typeorm';
import { FeedbackDto } from './dto/feedback.dto';

@Entity({ name: 'feedback' })
export class FeedbackEntity extends AbstractEntity<FeedbackDto> {
  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  dtoClass = FeedbackDto;
}
