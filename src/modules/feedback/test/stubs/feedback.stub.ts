import { FeedbackDto } from 'modules/feedback/dto/feedback.dto';
import { FeedbackEntity } from 'modules/feedback/feedback.entity';

export const feedbackDtoStub = (): FeedbackDto => {
  return {
    createdAt: new Date('July 21, 1983 01:15:00'),
    updatedAt: new Date('July 21, 1983 01:15:00'),
    id: '3e001628-ce09-47d1-8cdd-b4a76d91465b',
    name: 'test 1',
    description: 'sample feedback',
  };
};

export const feedbackEntityStub = (): FeedbackEntity => {
  return {
    ...feedbackDtoStub(),
    toDto: () => feedbackDtoStub(),
    dtoClass: FeedbackDto,
  };
};
