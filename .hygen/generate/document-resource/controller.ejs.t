---
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.controller.ts
---
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { <%= h.inflection.transform(name, ['pluralize']) %>Service } from './<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.service';
import { Create<%= name %>Dto } from './dto/create-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.dto';
import { Update<%= name %>Dto } from './dto/update-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { <%= name %> } from './domain/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { Protected, Public, SecuredEndpoint } from '../auth/auth.decorator';
import {
  ApiPagination,
  PaginationParams,
} from '../utils/decorators/pagination-params.decorator';
import { PaginationOptionsType } from '../utils/types/pagination-options.type';

@ApiTags('<%= h.inflection.transform(name, ['pluralize', 'humanize']) %>')
@SecuredEndpoint()
@Controller({
  path: '<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>',
  version: '1',
})
export class <%= h.inflection.transform(name, ['pluralize']) %>Controller {
  constructor(private readonly <%= h.inflection.camelize(h.inflection.pluralize(name), true) %>Service: <%= h.inflection.transform(name, ['pluralize']) %>Service) {}

  @Protected()
  @Post()
  @ApiCreatedResponse({
    type: <%= name %>,
  })
  create(@Body() create<%= name %>Dto: Create<%= name %>Dto) {
    return this.<%= h.inflection.camelize(h.inflection.pluralize(name), true) %>Service.create(create<%= name %>Dto);
  }

  @Public()
  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(<%= name %>),
  })
  @ApiPagination()
  async findAll(
    @PaginationParams() pagination: PaginationOptionsType,
  ): Promise<InfinityPaginationResponseDto<<%= name %>>> {
    return infinityPagination(
      await this.<%= h.inflection.camelize(h.inflection.pluralize(name), true) %>Service.findAllWithPagination({
        paginationOptions: pagination,
      }),
      pagination,
    );
  }

  @Public()
  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: <%= name %>,
  })
  findById(@Param('id') id: string) {
    return this.<%= h.inflection.camelize(h.inflection.pluralize(name), true) %>Service.findById(id);
  }

  @Protected()
  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: <%= name %>,
  })
  update(
    @Param('id') id: string,
    @Body() update<%= name %>Dto: Update<%= name %>Dto,
  ) {
    return this.<%= h.inflection.camelize(h.inflection.pluralize(name), true) %>Service.update(id, update<%= name %>Dto);
  }

  @Protected()
  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.<%= h.inflection.camelize(h.inflection.pluralize(name), true) %>Service.remove(id);
  }
}
