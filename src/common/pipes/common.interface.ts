interface PaginationInfo {
    total: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
}

interface PaginatedResponse<T> {
    items: T[];
    pagination: PaginationInfo;
}
