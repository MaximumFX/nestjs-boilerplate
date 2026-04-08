import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class InfinityPaginationResponseDto<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  currentPage: number;
  nextPage?: number;
}

export function InfinityPaginationResponse<T>(classReference: Type<T>) {
  abstract class Pagination {
    @ApiProperty({ type: [classReference] })
    data!: T[];

    @ApiProperty({
      type: Number,
      example: 20,
    })
    totalItems: number;

    @ApiProperty({
      type: Number,
      example: 2,
    })
    totalPages: number;

    @ApiProperty({
      type: Boolean,
      example: true,
    })
    hasNextPage: boolean;

    @ApiProperty({
      type: Number,
      example: 1,
    })
    currentPage: number;

    @ApiProperty({
      type: Number,
      example: 2,
    })
    nextPage?: number;
  }

  Object.defineProperty(Pagination, 'name', {
    writable: false,
    value: `InfinityPagination${classReference.name}ResponseDto`,
  });

  return Pagination;
}
