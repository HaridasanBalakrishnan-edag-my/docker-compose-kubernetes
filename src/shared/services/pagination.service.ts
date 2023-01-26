import { Injectable, NotFoundException } from '@nestjs/common';
import { Order } from 'common/constants/order';
import { CommonFilterOptionInput } from 'common/dto/common-filter.input';
import { filterByExactMatch } from 'helpers/filter-property-match';
import { MapDto } from 'helpers/map-dto';
import { FindOptionsWhere, Repository } from 'typeorm';

/**
 * Description of the service class PaginationService
 *
 * @template E Entity of the controller (ex: FeedbackEntity)
 * @template D Paginated DTO of the entity passed in E (ex: FeedbacksDto)
 */
@Injectable()
export class PaginationService<E, D> {
  private repo: Repository<E>;
  private partialKeys: string[] = [];

  /**
   * @param filter Entity of the controller (ex: FeedbackEntity)
   * @param option Common options for pagination
   * @param repository Repository for the module
   * @param dto Paginated DTO class of the entity passed in E (ex: FeedbacksDto)
   * @param partialKeys Optional, array of keys to perform partial search
   */
  async pagination(
    filter: FindOptionsWhere<E>,
    option: CommonFilterOptionInput,
    repository: Repository<E>,
    dto: any,
    partialKeys?: string[],
  ): Promise<D> {
    this.repo = repository;
    this.partialKeys = partialKeys || [];

    const { q, size, page, sortKey, sortOrder } = option;
    const filterParams = filter;
    const criteria = filterByExactMatch('alias', filterParams);
    const skip = page * size - size;
    const [row, total] = await this.findAll(
      criteria,
      q,
      size,
      skip,
      sortKey,
      sortOrder,
    );
    return new dto(MapDto(row as any), total, page, size);
  }

  private async findAll(
    filterCriteria: any[],
    queryString: string,
    size: number = 25,
    skip: number = 0,
    sortKey: string = 'updatedAt',
    sortOrder: Order = Order.DESC,
  ): Promise<[E[], number]> {
    const query = this.repo.createQueryBuilder('alias');
    if (skip) {
      query.skip(skip);
    }
    if (size) {
      query.take(size);
    }

    const orderByKey = `alias.${sortKey}`;
    query.orderBy(orderByKey, sortOrder);

    if (queryString) {
      this.partialKeys.forEach(key => {
        query.orWhere(`alias.${key} ILIKE :queryString`, {
          queryString: `%${queryString}%`,
        });
      });
    }

    if (filterCriteria) {
      for (const [condition, filterValues] of filterCriteria) {
        query.andWhere(condition, filterValues);
      }
    }

    try {
      return query.getManyAndCount();
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
