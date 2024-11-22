export const generatePagination = (
    total: number,
    currentPage: number,
    pageSize: number
) => {
    const totalPages = Math.ceil(total / pageSize);
    return {
        total,
        currentPage,
        pageSize,
        totalPages,
    };
};