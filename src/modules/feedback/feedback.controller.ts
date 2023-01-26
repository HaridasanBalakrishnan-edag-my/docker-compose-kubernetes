import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommonFilterOptionInput } from 'common/dto/common-filter.input';
import { ApiPaginatedResponse } from 'decorators/paginated-response.decorator';
import {
  FeedbackDto,
  FeedbacksDto,
  FeedbacksListDto,
} from 'modules/feedback/dto/feedback.dto';
import { PaginationService } from 'shared/services/pagination.service';
import {
  FeedbackCreateInput,
  FeedbackFilterInput,
  FeedbackUpdateInput,
} from './dto/feedback.input';
import { FeedbackEntity } from './feedback.entity';
import { FeedbackService } from './feedback.service';

@ApiTags('feedback')
@Controller('feedback')
export class FeedbackController {
  constructor(
    readonly service: FeedbackService,
    readonly paginationService: PaginationService<FeedbackEntity, FeedbacksDto>,
  ) {}

  @Post()
  async createFeedback(
    @Body() input: FeedbackCreateInput,
  ): Promise<FeedbackDto> {
    return this.service.create(input);
  }

  @Get(':id')
  async getFeedbackById(@Param('id') id: string): Promise<FeedbackDto> {
    return this.service.findOne({ where: { id } }, false);
  }

  @Delete()
  async deleteFeedback(
    @Query('ids', new ParseArrayPipe({ items: String, separator: ',' }))
    ids: string[],
  ): Promise<FeedbackDto[]> {
    return this.service.delete(ids);
  }

  @Put(':id')
  async updateFeedback(
    @Param('id') id: string,
    @Body() input: FeedbackUpdateInput,
  ): Promise<FeedbackDto> {
    return this.service.update(id, input);
  }

  @Get()
  @ApiPaginatedResponse(FeedbacksListDto)
  async getFeedbacks(
    @Query()
    filter: FeedbackFilterInput,
    @Query()
    option: CommonFilterOptionInput,
  ): Promise<FeedbacksDto> {
    return this.paginationService.pagination(
      filter,
      option,
      this.service.repo,
      FeedbacksDto,
      ['name', 'description'],
    );
  }
}
