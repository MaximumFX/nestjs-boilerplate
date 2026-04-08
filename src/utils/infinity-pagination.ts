import { PaginationOptionsType } from './types/pagination-options.type';
import { InfinityPaginationResponseDto } from './dto/infinity-pagination-response.dto';
import { CountedResourceType } from './types/counted-resource.type';

export const infinityPagination = <T>(
  data: CountedResourceType<T>,
  options: PaginationOptionsType,
): InfinityPaginationResponseDto<T> => {
  return {
    data: data.entities,
    hasNextPage: data.count === options.limit,
  };
};
