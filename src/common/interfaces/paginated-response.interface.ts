

export interface PaginatedMetaFormat {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export interface PaginatedResponse<T>{
    meta: PaginatedMetaFormat;
    data: T[];
}