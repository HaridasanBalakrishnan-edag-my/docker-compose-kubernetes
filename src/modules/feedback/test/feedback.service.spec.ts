import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FeedbackEntity } from '../feedback.entity';
import { FeedbackService } from '../feedback.service';
import { mockFeedbackRepo } from '../__mocks__/feedback.repo';
import { feedbackDtoStub, feedbackEntityStub } from './stubs/feedback.stub';

describe('FeedbackService', () => {
  let service: FeedbackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedbackService,
        {
          provide: getRepositoryToken(FeedbackEntity),
          useValue: mockFeedbackRepo,
        },
      ],
    }).compile();

    service = module.get<FeedbackService>(FeedbackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new record & return', async () => {
      expect(
        await service.create({
          name: feedbackEntityStub().name,
          description: feedbackEntityStub().description,
        }),
      ).toEqual(feedbackDtoStub());
    });
  });
});
