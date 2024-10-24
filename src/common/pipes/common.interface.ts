interface PaginationInfo {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

interface PaginatedResponse<T> {
    items: T[];
    pagination: PaginationInfo;
}
