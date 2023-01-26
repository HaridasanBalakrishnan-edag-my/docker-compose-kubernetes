import _ from 'lodash';
import 'source-map-support/register';
import { AbstractEntity } from './common/abstract.entity';
import { AbstractDto } from './common/dto/abstract.dto';

declare global {
  // tslint:disable-next-line:naming-convention no-unused
  interface Array<T> {
    toDtos<B extends AbstractDto>(this: AbstractEntity<B>[]): B[];
  }
}

Array.prototype.toDtos = function <B extends AbstractDto>(options?: any): B[] {
  // tslint:disable-next-line:no-invalid-this
  return _(this)
    .map(item => item.toDto(options))
    .compact()
    .value() as B[];
};
