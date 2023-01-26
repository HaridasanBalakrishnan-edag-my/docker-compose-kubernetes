import { Injectable } from '@nestjs/common';
import _ from 'lodash';

@Injectable()
export class ValidatorService {
  public isImage(mimeType: string): boolean {
    const imageMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/gif',
      'video/mpeg',
      'video/mp4',
      'video/x-ms-wmv',
    ];

    return _.includes(imageMimeTypes, mimeType);
  }
}
