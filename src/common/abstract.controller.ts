import { Get, NotFoundException, Query } from '@nestjs/common';
import { filterByExactMatch } from 'helpers/filter-property-match';
import { MapDto } from 'helpers/map-dto';
import { FindManyOptions, Repository } from 'typeorm';
import { Order } from './constants/order';
import { CommonFilterOptionInput } from './dto/common-filter.input';

/**
 * Description of the class AbstractController
 *
 * @template E Entity of the controller (ex: FeedbackEntity)
 * @template D Paginated DTO of the entity passed in E (ex: FeedbacksDto)
 */
export abstract class AbstractController<E, D> {
  private repo: Repository<E>;
  protected entityName: string;
  protected partialKeys: string[];
  protected dto;

  constructor(entityName: string, partialKeys: string[], dto) {
    this.entityName = entityName;
    this.partialKeys = partialKeys;
    this.dto = dto;
  }

  @Get()
  public async list(
    @Query() filter: FindManyOptions<E>,
    @Query() option: CommonFilterOptionInput,
  ): Promise<D> {
    const { q, size, page, sortKey, sortOrder } = option;
    const filterParams = filter;
    const criteria = filterByExactMatch(this.entityName, filterParams);
    const skip = page * size - size;
    const [row, total] = await this.findAll(
      criteria,
      q,
      size,
      skip,
      sortKey,
      sortOrder,
    );
    return new this.dto(MapDto(row as any), total, page, size);
  }

  async findAll(
    filterCriteria: any[],
    queryString: string,
    size: number = 25,
    skip: number = 0,
    sortKey: string = 'updatedAt',
    sortOrder: Order = Order.DESC,
  ): Promise<[E[], number]> {
    const query = this.repo.createQueryBuilder(this.entityName);
    if (skip) {
      query.skip(skip);
    }
    if (size) {
      query.take(size);
    }

    const orderByKey = `${this.entityName}.${sortKey}`;
    query.orderBy(orderByKey, sortOrder);

    if (queryString) {
      this.partialKeys.forEach(key => {
        query.orWhere(`${this.entityName}.${key} ILIKE :queryString`, {
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
