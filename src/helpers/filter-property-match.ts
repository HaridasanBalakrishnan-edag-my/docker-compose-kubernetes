export const filterByExactMatch = (tableName, filterParams = {}): any[] => {
  const criteria = [];
  for (const key in filterParams) {
    if (filterParams.hasOwnProperty(key)) {
      if (filterParams[key] !== undefined) {
        criteria.push([
          `${tableName}.${key} = :${key}`,
          {
            [key]: filterParams[key],
          },
        ]);
      }
    }
  }
  return criteria;
};
