import { PaginationOptionsType } from './types/pagination-options.type';
import { InfinityPaginationResponseDto } from './dto/infinity-pagination-response.dto';
import { CountedResourceType } from './types/counted-resource.type';

export const infinityPagination = <T>(
  data: CountedResourceType<T>,
  options: PaginationOptionsType,
): InfinityPaginationResponseDto<T> => {
  const totalPages = Math.ceil(data.count / options.limit);
  const hasNextPage = options.page < totalPages;
  return {
    data: data.entities,
    totalItems: data.count,
    totalPages,
    hasNextPage,
    currentPage: options.page,
    nextPage: hasNextPage ? options.page + 1 : undefined,
  };
};
