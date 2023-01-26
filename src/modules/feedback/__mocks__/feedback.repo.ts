import { feedbackEntityStub } from '../test/stubs/feedback.stub';

export const mockFeedbackRepo = {
  create: jest.fn().mockImplementation(dto => dto),
  save: jest
    .fn()
    .mockImplementation(() => Promise.resolve(feedbackEntityStub())),
  findOne: jest
    .fn()
    .mockImplementation(() => Promise.resolve(feedbackEntityStub())),
  preload: jest
    .fn()
    .mockImplementation(data =>
      Promise.resolve({ ...feedbackEntityStub(), ...data }),
    ),
  delete: jest
    .fn()
    .mockImplementation(() => Promise.resolve([feedbackEntityStub()])),
  find: jest
    .fn()
    .mockImplementation(() => Promise.resolve([feedbackEntityStub()])),
};
