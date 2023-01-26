type PaginatedType = {
  hasMore: boolean;
  items: any[];
  pages: number;
  total: number;
};

export const paginatedRes = (items: any[]): PaginatedType => ({
  hasMore: false,
  items,
  pages: null,
  total: items.length,
});
