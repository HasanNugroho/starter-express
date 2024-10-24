export const generatePagination = (
    total: number,
    page: number,
    pageSize: number
) => {
    const totalPages = Math.ceil(total / pageSize);
    return {
        total,
        page,
        pageSize,
        totalPages,
    };
};