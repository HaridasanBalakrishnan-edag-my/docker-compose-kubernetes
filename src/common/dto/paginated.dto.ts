import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class PageMetaDto {
  total: number;

  hasMore: boolean;

  page: number;

  pages: number;

  constructor(total: number, page: number, size: number) {
    this.total = total;
    this.page = page;
    this.pages = Math.ceil(total / size);
    this.hasMore = page < this.pages;
  }
}

export function PaginatedDto<T>(getNodeType: () => [Type<T>]) {
  abstract class PaginatedClass extends PageMetaDto {
    @ApiProperty()
    items: T[];

    constructor(items: T[], total: number, page: number, size: number) {
      super(total, page, size);
      this.items = items;
    }
  }
  return PaginatedClass;
}
