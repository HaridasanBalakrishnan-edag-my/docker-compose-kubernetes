import { Test, TestingModule } from '@nestjs/testing';
import { PaginationService } from 'shared/services/pagination.service';
import { FeedbackDto } from '../dto/feedback.dto';
import {
  FeedbackCreateInput,
  FeedbackUpdateInput,
} from '../dto/feedback.input';
import { FeedbackController } from '../feedback.controller';
import { FeedbackService } from '../feedback.service';
import { feedbackDtoStub } from './stubs/feedback.stub';

jest.mock('../feedback.service');

describe('FeedbackController', () => {
  let controller: FeedbackController;
  let service: FeedbackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedbackController],
      providers: [FeedbackService, PaginationService],
    }).compile();

    service = module.get<FeedbackService>(FeedbackService);
    controller = module.get<FeedbackController>(FeedbackController);
    jest.clearAllMocks();
  });

  describe('createFeedback', () => {
    describe('when createFeedback is called', () => {
      let feedback: FeedbackDto;
      let feedbackCreateInput: FeedbackCreateInput;

      beforeEach(async () => {
        feedbackCreateInput = {
          name: feedbackDtoStub().name,
          description: feedbackDtoStub().description,
        };
        feedback = await controller.createFeedback(feedbackCreateInput);
      });

      it('then it should call feedbackService', () => {
        expect(service.create).toBeCalledWith(feedbackCreateInput);
      });

      it('then it should return a feedback', () => {
        expect(feedback).toEqual(feedbackDtoStub());
      });
    });
  });

  describe('getFeedbackById', () => {
    describe('when getFeedbackById is called', () => {
      let feedback: FeedbackDto;

      beforeEach(async () => {
        feedback = await controller.getFeedbackById(feedbackDtoStub().id);
      });

      it('then it should call feedbackService', () => {
        expect(service.findOne).toBeCalledWith(
          { where: { id: feedbackDtoStub().id } },
          false,
        );
      });

      it('then it should return a feedback', () => {
        expect(feedback).toEqual(feedbackDtoStub());
      });
    });
  });

  describe('deleteFeedback', () => {
    describe('when deleteFeedback is called', () => {
      let feedback: FeedbackDto[];

      beforeEach(async () => {
        feedback = await controller.deleteFeedback([feedbackDtoStub().id]);
      });

      it('then it should call feedbackService', () => {
        expect(service.delete).toBeCalledWith([feedbackDtoStub().id]);
      });

      it('then it should return a feedback', () => {
        expect(feedback).toEqual([feedbackDtoStub()]);
      });
    });
  });

  describe('updateFeedback', () => {
    describe('when updateFeedback is called', () => {
      let feedback: FeedbackDto;
      let feedbackUpdateInput: FeedbackUpdateInput;

      beforeEach(async () => {
        feedbackUpdateInput = {
          name: 'it 2',
        };
        feedback = await controller.updateFeedback(
          feedbackDtoStub().id,
          feedbackUpdateInput,
        );
      });

      it('then it should call feedbackService', () => {
        expect(service.update).toBeCalledWith(
          feedbackDtoStub().id,
          feedbackUpdateInput,
        );
      });

      it('then it should return a feedback', () => {
        expect(feedback).toEqual(feedbackDtoStub());
      });
    });
  });
});
