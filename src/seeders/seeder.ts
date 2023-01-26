import { Logger, Injectable } from '@nestjs/common';
import { FeedbackSeederService } from './feedback/feedback.service';

@Injectable()
export class Seeder {
  constructor(
    private readonly logger: Logger,
    private readonly feedbackSeederService: FeedbackSeederService,
  ) {}

  async seedFeedback() {
    return Promise.all(this.feedbackSeederService.create())
      .then(results => {
        this.logger.debug(
          `Total ${results.length} of feedbacks has been created `,
        );
        return Promise.resolve(true);
      })
      .catch(error => Promise.reject(error));
  }

  async seed() {
    try {
      await this.seedFeedback();

      this.logger.debug('Successfully completed seeding...');
      return true;
    } catch (err) {
      this.logger.error('Failed seeding...', err);
      return false;
    }
  }
}
