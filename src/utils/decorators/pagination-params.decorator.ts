import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function ApiPagination() {
  return function (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      example: 1,
    })(target, propertyKey, descriptor);

    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      example: 10,
    })(target, propertyKey, descriptor);
  };
}

export const PaginationParams = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const pageRaw = request.query.page;
    const limitRaw = request.query.limit;

    const page = pageRaw ? Number(pageRaw) : 1;
    const limit = limitRaw ? Number(limitRaw) : 10;

    if (!Number.isInteger(page) || page <= 0) {
      throw new BadRequestException('page must be a positive integer');
    }

    if (!Number.isInteger(limit) || limit <= 0 || limit > 50) {
      throw new BadRequestException(
        'limit must be a positive integer not greater than 50',
      );
    }

    return {
      page,
      limit,
      skip: (page - 1) * limit,
    };
  },
);
