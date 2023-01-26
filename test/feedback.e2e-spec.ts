import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import {
  FeedbackCreateInput,
  FeedbackUpdateInput,
} from 'modules/feedback/dto/feedback.input';
import { feedbackDtoStub } from 'modules/feedback/test/stubs/feedback.stub';
import { AppModule } from '../src/app.module';
import connection from './utils/clean-up-db';
import { FeedbackEntity } from 'modules/feedback/feedback.entity';
import { paginatedRes } from './utils/paginated-res';

describe('FeedbackController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    await connection.create();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await connection.close();
  });

  beforeEach(async () => {
    await connection.clear();
  });

  it('should create a new feedback', async () => {
    const feedbackCreateInput: FeedbackCreateInput = {
      name: feedbackDtoStub().name,
      description: feedbackDtoStub().description,
    };

    const response = await request(app.getHttpServer())
      .post('/feedback')
      .send(feedbackCreateInput);

    expect(response.statusCode).toBe(201);
  });

  it('should get a feedback by id', async () => {
    await connection.insert(FeedbackEntity, [feedbackDtoStub()]);

    const response = await request(app.getHttpServer()).get(
      `/feedback/${feedbackDtoStub().id}`,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      ...feedbackDtoStub(),
      createdAt: feedbackDtoStub().createdAt.toISOString(),
      updatedAt: feedbackDtoStub().updatedAt.toISOString(),
    });
  });

  it('should delete feedback', async () => {
    await connection.insert(FeedbackEntity, [feedbackDtoStub()]);

    const response = await request(app.getHttpServer())
      .delete(`/feedback`)
      .query({ ids: [feedbackDtoStub().id] });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      {
        ...feedbackDtoStub(),
        createdAt: feedbackDtoStub().createdAt.toISOString(),
        updatedAt: feedbackDtoStub().updatedAt.toISOString(),
      },
    ]);
  });

  it('should update feedback', async () => {
    await connection.insert(FeedbackEntity, [feedbackDtoStub()]);

    const feedbackUpdateInput: FeedbackUpdateInput = {
      name: 'test 2',
    };

    const response = await request(app.getHttpServer())
      .put(`/feedback/${feedbackDtoStub().id}`)
      .send(feedbackUpdateInput);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      ...feedbackDtoStub(),
      name: feedbackUpdateInput.name,
      createdAt: feedbackDtoStub().createdAt.toISOString(),
      updatedAt: response.body.updatedAt,
    });
  });

  it('should get all feedback', async () => {
    await connection.insert(FeedbackEntity, [feedbackDtoStub()]);

    const response = await request(app.getHttpServer()).get(`/feedback`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      paginatedRes([
        {
          ...feedbackDtoStub(),
          createdAt: feedbackDtoStub().createdAt.toISOString(),
          updatedAt: feedbackDtoStub().updatedAt.toISOString(),
        },
      ]),
    );
  });
});
