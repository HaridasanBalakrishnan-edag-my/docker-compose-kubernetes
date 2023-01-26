import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedbackEntity } from 'modules/feedback/feedback.entity';
import { Repository } from 'typeorm';
import { Feedbacks } from './data';

@Injectable()
export class FeedbackSeederService {
  constructor(
    @InjectRepository(FeedbackEntity)
    private repository: Repository<FeedbackEntity>,
  ) {}

  create(): Array<Promise<FeedbackEntity>> {
    return Feedbacks.map(async feedback => {
      return new Promise<FeedbackEntity>((resolve, reject) => {
        const query = {
          id: feedback.id,
        };
        this.repository
          .findOneBy(query)
          .then(async data => {
            if (data) return resolve(data);
            const result = await this.repository.save(feedback);
            return resolve(result);
          })
          .catch(error => reject(error));
      });
    });
  }
}
