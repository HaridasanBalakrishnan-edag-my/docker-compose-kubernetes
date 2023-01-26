import { feedbackDtoStub } from '../test/stubs/feedback.stub';

export const FeedbackService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(feedbackDtoStub()),
  findOne: jest.fn().mockResolvedValue(feedbackDtoStub()),
  delete: jest.fn().mockResolvedValue([feedbackDtoStub()]),
  update: jest.fn().mockResolvedValue(feedbackDtoStub()),
});
